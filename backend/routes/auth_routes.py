from fastapi import APIRouter, HTTPException, Request, Response, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import logging
from auth import get_session_data_from_emergent, create_or_get_user, create_user_session, logout_user
from models import APIResponse

logger = logging.getLogger(__name__)

# Import database from server
from server import db

def get_database() -> AsyncIOMotorDatabase:
    return db

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/session", response_model=APIResponse)
async def process_session(
    request: Request,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Process session ID from Emergent Auth and create user session"""
    try:
        # Get session_id from header
        session_id = request.headers.get("X-Session-ID")
        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session ID required in X-Session-ID header"
            )
        
        # Get session data from Emergent
        session_data = await get_session_data_from_emergent(session_id)
        if not session_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session ID"
            )
        
        # Create or get user
        user = await create_or_get_user(db, session_data)
        
        # Create user session
        user_session = await create_user_session(db, user.id, session_data.session_token)
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_data.session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return APIResponse(
            success=True,
            message="Authentication successful",
            data={
                "user": user.model_dump(),
                "expires_at": user_session.expires_at.isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/logout", response_model=APIResponse)
async def logout(
    request: Request,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Logout user"""
    try:
        # Get session token
        session_token = request.cookies.get("session_token")
        if not session_token:
            authorization = request.headers.get("authorization")
            if authorization and authorization.startswith("Bearer "):
                session_token = authorization.split(" ")[1]
        
        if session_token:
            await logout_user(db, session_token)
        
        # Clear cookie
        response.delete_cookie(
            key="session_token",
            path="/",
            secure=True,
            samesite="none"
        )
        
        return APIResponse(
            success=True,
            message="Logged out successfully"
        )
        
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during logout"
        )


@router.get("/me", response_model=APIResponse)
async def get_current_user_info(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user information"""
    try:
        from auth import get_current_user
        user = await get_current_user(request, db)
        
        return APIResponse(
            success=True,
            message="User information retrieved",
            data={"user": user.model_dump()}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user information"
        )