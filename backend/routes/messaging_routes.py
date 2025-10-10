from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timezone
import logging
from auth import get_current_user
from models import (
    User, Conversation, Message, MessageCreate, MessageResponse,
    ConversationDetail, ConnectionStatus, APIResponse
)

logger = logging.getLogger(__name__)

# Import database
from database import get_database

router = APIRouter(prefix="/conversations", tags=["messaging"])


@router.get("", response_model=APIResponse)
async def get_conversations(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get all conversations for current user"""
    try:
        current_user = await get_current_user(request, db)
        
        # Build aggregation pipeline to get conversations with other user info and last message
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"user1_id": current_user.id},
                        {"user2_id": current_user.id}
                    ],
                    "is_active": True
                }
            },
            {
                "$addFields": {
                    "other_user_id": {
                        "$cond": [
                            {"$eq": ["$user1_id", current_user.id]},
                            "$user2_id",
                            "$user1_id"
                        ]
                    }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "other_user_id",
                    "foreignField": "id",
                    "as": "other_user"
                }
            },
            {"$unwind": "$other_user"},
            {
                "$lookup": {
                    "from": "messages",
                    "let": {"conv_id": "$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$conversation_id", "$$conv_id"]}}},
                        {"$sort": {"timestamp": -1}},
                        {"$limit": 1}
                    ],
                    "as": "last_message_doc"
                }
            },
            {
                "$addFields": {
                    "other_user_name": "$other_user.name",
                    "other_user_email": "$other_user.email",
                    "other_user_picture": "$other_user.picture",
                    "last_message": {
                        "$arrayElemAt": ["$last_message_doc.content", 0]
                    },
                    "last_message_time": {
                        "$arrayElemAt": ["$last_message_doc.timestamp", 0]
                    }
                }
            },
            {
                "$addFields": {
                    "last_message_at": {
                        "$ifNull": ["$last_message_time", "$created_at"]
                    }
                }
            },
            {
                "$lookup": {
                    "from": "messages",
                    "let": {"conv_id": "$id", "user_id": current_user.id},
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$and": [
                                        {"$eq": ["$conversation_id", "$$conv_id"]},
                                        {"$ne": ["$sender_id", "$$user_id"]},
                                        {"$eq": ["$is_read", False]}
                                    ]
                                }
                            }
                        },
                        {"$count": "unread"}
                    ],
                    "as": "unread_count_doc"
                }
            },
            {
                "$addFields": {
                    "unread_count": {
                        "$ifNull": [
                            {"$arrayElemAt": ["$unread_count_doc.unread", 0]},
                            0
                        ]
                    }
                }
            },
            {
                "$project": {
                    "other_user": 0,
                    "last_message_doc": 0,
                    "last_message_time": 0,
                    "unread_count_doc": 0,
                    "other_user_id": 0
                }
            },
            {"$sort": {"last_message_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        conversations = await db.conversations.aggregate(pipeline).to_list(limit)
        conversations_response = [ConversationDetail(**conv) for conv in conversations]
        
        # Get total count
        total_count = await db.conversations.count_documents({
            "$or": [
                {"user1_id": current_user.id},
                {"user2_id": current_user.id}
            ],
            "is_active": True
        })
        
        return APIResponse(
            success=True,
            message="Conversations retrieved successfully",
            data={
                "conversations": [c.model_dump() for c in conversations_response],
                "pagination": {
                    "skip": skip,
                    "limit": limit,
                    "total": total_count,
                    "has_more": (skip + limit) < total_count
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving conversations"
        )


@router.get("/{conversation_id}/messages", response_model=APIResponse)
async def get_messages(
    conversation_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get messages from a conversation"""
    try:
        current_user = await get_current_user(request, db)
        
        # Check if user is part of the conversation
        conversation = await db.conversations.find_one({
            "id": conversation_id,
            "$or": [
                {"user1_id": current_user.id},
                {"user2_id": current_user.id}
            ]
        })
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
        
        # Get messages
        messages = await db.messages.find(
            {"conversation_id": conversation_id}
        ).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
        
        # Reverse to show oldest first
        messages.reverse()
        
        messages_response = [MessageResponse(**msg) for msg in messages]
        
        # Mark messages as read for current user
        await db.messages.update_many(
            {
                "conversation_id": conversation_id,
                "sender_id": {"$ne": current_user.id},
                "is_read": False
            },
            {"$set": {"is_read": True}}
        )
        
        # Get total count
        total_count = await db.messages.count_documents({"conversation_id": conversation_id})
        
        return APIResponse(
            success=True,
            message="Messages retrieved successfully",
            data={
                "messages": [m.model_dump() for m in messages_response],
                "pagination": {
                    "skip": skip,
                    "limit": limit,
                    "total": total_count,
                    "has_more": (skip + limit) < total_count
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting messages: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving messages"
        )


@router.post("/{conversation_id}/messages", response_model=APIResponse)
async def send_message(
    conversation_id: str,
    message_data: MessageCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Send a message in a conversation"""
    try:
        current_user = await get_current_user(request, db)
        
        # Check if user is part of the conversation
        conversation = await db.conversations.find_one({
            "id": conversation_id,
            "$or": [
                {"user1_id": current_user.id},
                {"user2_id": current_user.id}
            ]
        })
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
        
        # Check if users are still connected (connection not blocked/rejected)
        other_user_id = (
            conversation["user2_id"] if conversation["user1_id"] == current_user.id 
            else conversation["user1_id"]
        )
        
        connection_check = await db.connection_requests.find_one({
            "$or": [
                {"sender_id": current_user.id, "receiver_id": other_user_id},
                {"sender_id": other_user_id, "receiver_id": current_user.id}
            ],
            "status": ConnectionStatus.ACCEPTED
        })
        
        if not connection_check:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot send message - connection not established"
            )
        
        # Create message
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user.id,
            content=message_data.content.strip()
        )
        
        await db.messages.insert_one(message.model_dump())
        
        # Update conversation last_message_at
        await db.conversations.update_one(
            {"id": conversation_id},
            {"$set": {"last_message_at": message.timestamp}}
        )
        
        return APIResponse(
            success=True,
            message="Message sent successfully",
            data={"message": message.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error sending message"
        )


@router.get("/{conversation_id}", response_model=APIResponse)
async def get_conversation_details(
    conversation_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get conversation details"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get conversation with other user info
        pipeline = [
            {
                "$match": {
                    "id": conversation_id,
                    "$or": [
                        {"user1_id": current_user.id},
                        {"user2_id": current_user.id}
                    ]
                }
            },
            {
                "$addFields": {
                    "other_user_id": {
                        "$cond": [
                            {"$eq": ["$user1_id", current_user.id]},
                            "$user2_id",
                            "$user1_id"
                        ]
                    }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "other_user_id",
                    "foreignField": "id",
                    "as": "other_user"
                }
            },
            {"$unwind": "$other_user"},
            {
                "$addFields": {
                    "other_user_name": "$other_user.name",
                    "other_user_email": "$other_user.email",
                    "other_user_picture": "$other_user.picture"
                }
            },
            {"$project": {"other_user": 0, "other_user_id": 0}}
        ]
        
        result = await db.conversations.aggregate(pipeline).to_list(1)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
        
        conversation = ConversationDetail(**result[0])
        
        return APIResponse(
            success=True,
            message="Conversation details retrieved successfully",
            data={"conversation": conversation.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving conversation details"
        )