from fastapi import HTTPException, Request, status, Depends
from datetime import datetime, timezone, timedelta
from typing import Optional
import aiohttp
import logging
from models import User, UserSession, SessionData

logger = logging.getLogger(__name__)


async def get_session_data_from_emergent(session_id: str) -> Optional[SessionData]:
    """Get session data from Emergent Auth service"""
    try:
        url = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
        headers = {"X-Session-ID": session_id}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    return SessionData(**data)
                else:
                    logger.error(f"Failed to get session data: {response.status}")
                    return None
    except Exception as e:
        logger.error(f"Error getting session data: {str(e)}")
        return None


async def create_or_get_user(db, session_data: SessionData, is_new_user: bool = False) -> tuple[User, bool]:
    """Create user if not exists, or get existing user. Returns (user, is_newly_created)"""
    try:
        # Check if user exists
        existing_user = await db.users.find_one({"email": session_data.email})
        
        if existing_user:
            # Existing user - check if they need onboarding
            should_update = False
            updates = {}
            
            # Only check profile status if onboarding is not already marked as complete
            if not existing_user.get("onboarding_completed", False):
                # Check if user has a profile
                existing_profile = await db.user_profiles.find_one({"user_id": existing_user["id"]})
                if existing_profile:
                    # User has a profile - they've already completed setup, just need to mark it
                    logger.info(f"User {session_data.email} has profile but onboarding not marked complete, fixing...")
                    updates["onboarding_completed"] = True
                    should_update = True
                else:
                    # User exists but no profile and onboarding not complete
                    # Keep onboarding_completed as False - they need to go through onboarding
                    logger.info(f"User {session_data.email} exists without profile, needs onboarding")
                    # Ensure the field exists and is False
                    if "onboarding_completed" not in existing_user:
                        updates["onboarding_completed"] = False
                        should_update = True
            
            # Apply updates if needed
            if should_update:
                await db.users.update_one(
                    {"email": session_data.email},
                    {"$set": updates}
                )
                existing_user.update(updates)
            
            # Return existing user with is_newly_created=False
            return User(**existing_user), False
        
        # Create new user with onboarding_completed=False and placeholder name
        # User will provide their actual name during onboarding
        user = User(
            email=session_data.email,
            name="",  # Empty name - will be filled during onboarding
            picture=session_data.picture,
            onboarding_completed=False  # New users need onboarding
        )
        
        await db.users.insert_one(user.model_dump())
        logger.info(f"Created new user with email: {session_data.email}, onboarding required")
        return user, True  # is_newly_created=True
        
    except Exception as e:
        logger.error(f"Error creating/getting user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing user data"
        )


async def create_user_session(db, user_id: str, session_token: str) -> UserSession:
    """Create a new user session"""
    try:
        # Delete any existing sessions for this user
        await db.user_sessions.delete_many({"user_id": user_id})
        
        # Create new session
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session = UserSession(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        await db.user_sessions.insert_one(session.model_dump())
        return session
        
    except Exception as e:
        logger.error(f"Error creating session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating session"
        )


async def get_current_user_from_session_token(db, session_token: str) -> Optional[User]:
    """Get current user from session token"""
    try:
        # Find active session
        session = await db.user_sessions.find_one({
            "session_token": session_token,
            "is_active": True,
            "expires_at": {"$gt": datetime.now(timezone.utc)}
        })
        
        if not session:
            return None
            
        # Get user
        user_data = await db.users.find_one({"id": session["user_id"]})
        if not user_data:
            return None
            
        return User(**user_data)
        
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        return None


async def get_current_user(request: Request, db) -> User:
    """Dependency to get current authenticated user"""
    session_token = None
    
    # Try to get session token from cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        authorization = request.headers.get("authorization")
        if authorization and authorization.startswith("Bearer "):
            session_token = authorization.split(" ")[1]
    
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = await get_current_user_from_session_token(db, session_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )
    
    return user


async def logout_user(db, session_token: str):
    """Logout user by deactivating session"""
    try:
        await db.user_sessions.update_one(
            {"session_token": session_token},
            {"$set": {"is_active": False}}
        )
    except Exception as e:
        logger.error(f"Error logging out user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error logging out"
        )