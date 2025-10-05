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


async def create_or_get_user(db, session_data: SessionData) -> User:
    """Create user if not exists, or get existing user"""
    try:
        # Check if user exists
        existing_user = await db.users.find_one({"email": session_data.email})
        
        if existing_user:
            return User(**existing_user)
        
        # Create new user
        user = User(
            email=session_data.email,
            name=session_data.name,
            picture=session_data.picture
        )
        
        await db.users.insert_one(user.model_dump())
        return user
        
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