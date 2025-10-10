from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timezone
import logging
from auth import get_current_user
from models import (
    User, ConnectionRequest, ConnectionRequestCreate, ConnectionRequestResponse,
    ConnectionRequestDetail, ConnectionStatus, Conversation, APIResponse
)

logger = logging.getLogger(__name__)

# Import database
from database import get_database

router = APIRouter(prefix="/connections", tags=["connections"])


@router.post("/request", response_model=APIResponse)
async def send_connection_request(
    request_data: ConnectionRequestCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Send a connection request"""
    try:
        current_user = await get_current_user(request, db)
        
        # Check if receiver exists and has a profile
        receiver_profile = await db.user_profiles.find_one({"user_id": request_data.receiver_id})
        if not receiver_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found or profile not available"
            )
        
        # Check if receiver is open for connections
        if not receiver_profile.get("is_open_for_connection", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not open for connections"
            )
        
        # Check if connection request already exists
        existing_request = await db.connection_requests.find_one({
            "$or": [
                {"sender_id": current_user.id, "receiver_id": request_data.receiver_id},
                {"sender_id": request_data.receiver_id, "receiver_id": current_user.id}
            ]
        })
        
        if existing_request:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Connection request already exists"
            )
        
        # Create connection request
        connection_request = ConnectionRequest(
            sender_id=current_user.id,
            receiver_id=request_data.receiver_id,
            message=request_data.message
        )
        
        await db.connection_requests.insert_one(connection_request.model_dump())
        
        return APIResponse(
            success=True,
            message="Connection request sent successfully",
            data={"request": connection_request.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending connection request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error sending connection request"
        )


@router.get("/requests/received", response_model=APIResponse)
async def get_received_requests(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get connection requests received by current user"""
    try:
        current_user = await get_current_user(request, db)
        
        # Build aggregation pipeline to get requests with sender info
        pipeline = [
            {"$match": {"receiver_id": current_user.id}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "sender_id",
                    "foreignField": "id",
                    "as": "sender"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "receiver_id",
                    "foreignField": "id",
                    "as": "receiver"
                }
            },
            {"$unwind": "$sender"},
            {"$unwind": "$receiver"},
            {
                "$addFields": {
                    "sender_name": "$sender.name",
                    "sender_email": "$sender.email",
                    "sender_picture": "$sender.picture",
                    "receiver_name": "$receiver.name",
                    "receiver_email": "$receiver.email",
                    "receiver_picture": "$receiver.picture"
                }
            },
            {"$project": {"sender": 0, "receiver": 0}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        requests = await db.connection_requests.aggregate(pipeline).to_list(limit)
        requests_response = [ConnectionRequestDetail(**req) for req in requests]
        
        # Get total count
        total_count = await db.connection_requests.count_documents({"receiver_id": current_user.id})
        
        return APIResponse(
            success=True,
            message="Received requests retrieved successfully",
            data={
                "requests": [r.model_dump() for r in requests_response],
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
        logger.error(f"Error getting received requests: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving received requests"
        )


@router.get("/requests/sent", response_model=APIResponse)
async def get_sent_requests(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get connection requests sent by current user"""
    try:
        current_user = await get_current_user(request, db)
        
        # Build aggregation pipeline to get requests with receiver info
        pipeline = [
            {"$match": {"sender_id": current_user.id}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "sender_id",
                    "foreignField": "id",
                    "as": "sender"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "receiver_id",
                    "foreignField": "id",
                    "as": "receiver"
                }
            },
            {"$unwind": "$sender"},
            {"$unwind": "$receiver"},
            {
                "$addFields": {
                    "sender_name": "$sender.name",
                    "sender_email": "$sender.email",
                    "sender_picture": "$sender.picture",
                    "receiver_name": "$receiver.name",
                    "receiver_email": "$receiver.email",
                    "receiver_picture": "$receiver.picture"
                }
            },
            {"$project": {"sender": 0, "receiver": 0}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        requests = await db.connection_requests.aggregate(pipeline).to_list(limit)
        requests_response = [ConnectionRequestDetail(**req) for req in requests]
        
        # Get total count
        total_count = await db.connection_requests.count_documents({"sender_id": current_user.id})
        
        return APIResponse(
            success=True,
            message="Sent requests retrieved successfully",
            data={
                "requests": [r.model_dump() for r in requests_response],
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
        logger.error(f"Error getting sent requests: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving sent requests"
        )


@router.put("/requests/{request_id}/respond", response_model=APIResponse)
async def respond_to_connection_request(
    request_id: str,
    response_data: ConnectionRequestResponse,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Accept or reject a connection request"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get the connection request
        connection_request = await db.connection_requests.find_one({"id": request_id})
        if not connection_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection request not found"
            )
        
        # Check if current user is the receiver
        if connection_request["receiver_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only respond to requests sent to you"
            )
        
        # Check if request is still pending
        if connection_request["status"] != ConnectionStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Request has already been responded to"
            )
        
        # Update request status
        await db.connection_requests.update_one(
            {"id": request_id},
            {
                "$set": {
                    "status": response_data.status,
                    "responded_at": datetime.now(timezone.utc)
                }
            }
        )
        
        # If accepted, create conversation
        if response_data.status == ConnectionStatus.ACCEPTED:
            # Check if conversation already exists
            existing_conversation = await db.conversations.find_one({
                "$or": [
                    {
                        "user1_id": connection_request["sender_id"],
                        "user2_id": connection_request["receiver_id"]
                    },
                    {
                        "user1_id": connection_request["receiver_id"],
                        "user2_id": connection_request["sender_id"]
                    }
                ]
            })
            
            if not existing_conversation:
                conversation = Conversation(
                    user1_id=connection_request["sender_id"],
                    user2_id=connection_request["receiver_id"]
                )
                await db.conversations.insert_one(conversation.model_dump())
        
        return APIResponse(
            success=True,
            message=f"Connection request {response_data.status.value} successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error responding to connection request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error responding to connection request"
        )


@router.get("/established", response_model=APIResponse)
async def get_established_connections(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get established connections for current user"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get accepted connection requests
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"sender_id": current_user.id},
                        {"receiver_id": current_user.id}
                    ],
                    "status": ConnectionStatus.ACCEPTED
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "sender_id",
                    "foreignField": "id",
                    "as": "sender"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "receiver_id",
                    "foreignField": "id",
                    "as": "receiver"
                }
            },
            {"$unwind": "$sender"},
            {"$unwind": "$receiver"},
            {
                "$addFields": {
                    "sender_name": "$sender.name",
                    "sender_email": "$sender.email",
                    "sender_picture": "$sender.picture",
                    "receiver_name": "$receiver.name",
                    "receiver_email": "$receiver.email",
                    "receiver_picture": "$receiver.picture"
                }
            },
            {"$project": {"sender": 0, "receiver": 0}},
            {"$sort": {"responded_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        connections = await db.connection_requests.aggregate(pipeline).to_list(limit)
        connections_response = [ConnectionRequestDetail(**conn) for conn in connections]
        
        # Get total count
        total_count = await db.connection_requests.count_documents({
            "$or": [
                {"sender_id": current_user.id},
                {"receiver_id": current_user.id}
            ],
            "status": ConnectionStatus.ACCEPTED
        })
        
        return APIResponse(
            success=True,
            message="Established connections retrieved successfully",
            data={
                "connections": [c.model_dump() for c in connections_response],
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
        logger.error(f"Error getting established connections: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving established connections"
        )