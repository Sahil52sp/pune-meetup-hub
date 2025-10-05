from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime
import logging
from auth import get_current_user
from models import (
    User, UserProfile, UserProfileCreate, UserProfileUpdate, 
    UserProfileResponse, APIResponse
)

logger = logging.getLogger(__name__)

# Import database
from database import get_database

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("", response_model=APIResponse)
async def create_profile(
    profile_data: UserProfileCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create user profile"""
    try:
        current_user = await get_current_user(request, db)
        
        # Check if profile already exists
        existing_profile = await db.user_profiles.find_one({"user_id": current_user.id})
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists"
            )
        
        # Create profile
        profile = UserProfile(
            user_id=current_user.id,
            **profile_data.model_dump()
        )
        
        await db.user_profiles.insert_one(profile.model_dump())
        
        return APIResponse(
            success=True,
            message="Profile created successfully",
            data={"profile": profile.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating profile"
        )


@router.get("", response_model=APIResponse)
async def get_my_profile(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user's profile"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get profile with user data
        pipeline = [
            {"$match": {"user_id": current_user.id}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$addFields": {
                    "user_name": "$user.name",
                    "user_email": "$user.email",
                    "user_picture": "$user.picture"
                }
            },
            {"$project": {"user": 0}}
        ]
        
        result = await db.user_profiles.aggregate(pipeline).to_list(1)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        profile = UserProfileResponse(**result[0])
        
        return APIResponse(
            success=True,
            message="Profile retrieved successfully",
            data={"profile": profile.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving profile"
        )


@router.put("", response_model=APIResponse)
async def update_profile(
    profile_data: UserProfileUpdate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update user profile"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get existing profile
        existing_profile = await db.user_profiles.find_one({"user_id": current_user.id})
        if not existing_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Update only provided fields
        update_data = {k: v for k, v in profile_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$set": update_data}
        )
        
        return APIResponse(
            success=True,
            message="Profile updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating profile"
        )


@router.get("/browse", response_model=APIResponse)
async def browse_profiles(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    company: Optional[str] = Query(None)
):
    """Browse profiles of users open for connections"""
    try:
        current_user = await get_current_user(request, db)
        
        # Build match filter
        match_filter = {
            "is_open_for_connection": True,
            "user_id": {"$ne": current_user.id}  # Exclude current user
        }
        
        # Add search filters
        if search:
            match_filter["$or"] = [
                {"job_title": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"bio": {"$regex": search, "$options": "i"}},
                {"skills": {"$regex": search, "$options": "i"}},
                {"interests": {"$regex": search, "$options": "i"}}
            ]
        
        if location:
            match_filter["location"] = {"$regex": location, "$options": "i"}
            
        if company:
            match_filter["company"] = {"$regex": company, "$options": "i"}
        
        # Build aggregation pipeline
        pipeline = [
            {"$match": match_filter},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$addFields": {
                    "user_name": "$user.name",
                    "user_email": "$user.email",
                    "user_picture": "$user.picture"
                }
            },
            {"$project": {"user": 0}},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        profiles = await db.user_profiles.aggregate(pipeline).to_list(limit)
        profiles_response = [UserProfileResponse(**profile) for profile in profiles]
        
        # Get total count for pagination
        count_pipeline = [
            {"$match": match_filter},
            {"$count": "total"}
        ]
        count_result = await db.user_profiles.aggregate(count_pipeline).to_list(1)
        total_count = count_result[0]["total"] if count_result else 0
        
        return APIResponse(
            success=True,
            message="Profiles retrieved successfully",
            data={
                "profiles": [p.model_dump() for p in profiles_response],
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
        logger.error(f"Error browsing profiles: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error browsing profiles"
        )


@router.get("/{user_id}", response_model=APIResponse)
async def get_user_profile(
    user_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get specific user's profile"""
    try:
        current_user = await get_current_user(request, db)
        
        # Get profile with user data
        pipeline = [
            {"$match": {"user_id": user_id}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$addFields": {
                    "user_name": "$user.name",
                    "user_email": "$user.email",
                    "user_picture": "$user.picture"
                }
            },
            {"$project": {"user": 0}}
        ]
        
        result = await db.user_profiles.aggregate(pipeline).to_list(1)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        profile = UserProfileResponse(**result[0])
        
        return APIResponse(
            success=True,
            message="Profile retrieved successfully",
            data={"profile": profile.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user profile"
        )