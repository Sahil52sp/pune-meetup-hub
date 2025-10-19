from fastapi import APIRouter, HTTPException, Request, Response, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import logging
from auth import get_session_data_from_emergent, create_or_get_user, create_user_session, logout_user
from models import APIResponse

logger = logging.getLogger(__name__)

# Import database
from database import get_database

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/test")
async def test_endpoint():
    """Simple test endpoint to verify backend is working"""
    return {"message": "Auth router is working!", "status": "ok"}


@router.post("/dev-login")
@router.get("/dev-login")
async def dev_login(
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Development-only login endpoint that bypasses OAuth"""
    import os
    import uuid
    from datetime import datetime, timezone
    
    # Only allow in development mode
    if os.environ.get('ENVIRONMENT', 'development') != 'development':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Development login is only available in development mode"
        )
    
    try:
        logger.info("Starting dev login process...")
        
        # Create a test user
        test_email = "dev@localhost.com"
        test_name = ""  # Empty name - will be filled during onboarding
        test_picture = "https://ui-avatars.com/api/?name=Dev+User"
        
        logger.info(f"Looking for existing user with email: {test_email}")
        
        # Always create a fresh user for testing onboarding
        logger.info("Creating fresh test user for onboarding testing")
        # Delete existing user if exists
        await db.users.delete_many({"email": test_email})
        
        # Create new test user without onboarding_completed
        user_data = {
            "id": str(uuid.uuid4()),
            "email": test_email,
            "name": test_name,
            "picture": test_picture,
            "created_at": datetime.now(timezone.utc),
            "is_active": True,
            "onboarding_completed": False
        }
        
        # Insert user into database
        result = await db.users.insert_one(user_data)
        logger.info(f"Fresh user created with ID: {result.inserted_id}")
        
        # Create session token
        session_token = str(uuid.uuid4())
        logger.info(f"Created session token: {session_token[:8]}...")
        
        # Create user session
        from datetime import timedelta
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_data["id"],
            "session_token": session_token,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc),
            "is_active": True
        }
        
        # Insert session into database
        session_result = await db.user_sessions.insert_one(session_data)
        logger.info(f"Session created with ID: {session_result.inserted_id}")
        
        # Set cookie
        is_production = os.environ.get('ENVIRONMENT', 'development') == 'production'
        response.set_cookie(
            key="session_token",
            value=session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=is_production,
            samesite="none" if is_production else "lax",
            path="/"
        )
        
        logger.info("Dev login successful!")
        
        # Return simple dict to avoid serialization issues
        return {
            "success": True,
            "message": "Development login successful",
            "data": {
                "user": {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "picture": user_data.get("picture"),
                    "created_at": user_data["created_at"].isoformat() if isinstance(user_data["created_at"], datetime) else str(user_data["created_at"]),
                    "is_active": user_data.get("is_active", True),
                    "onboarding_completed": user_data.get("onboarding_completed", False)
                },
                "expires_at": expires_at.isoformat()
            }
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Error in dev login: {str(e)}")
        logger.error(f"Traceback: {error_details}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Development login failed: {str(e)}"
        )


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
        user, is_new_user = await create_or_get_user(db, session_data)
        
        # Create user session
        user_session = await create_user_session(db, user.id, session_data.session_token)
        
        # Log user status
        logger.info(f"User {'created' if is_new_user else 'logged in'}: {user.email}, onboarding_completed: {user.onboarding_completed}")
        
        # Set httpOnly cookie
        # In development, use secure=False and samesite="lax" for localhost
        import os
        is_production = os.environ.get('ENVIRONMENT', 'development') == 'production'
        
        response.set_cookie(
            key="session_token",
            value=session_data.session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=is_production,
            samesite="none" if is_production else "lax",
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
        import os
        is_production = os.environ.get('ENVIRONMENT', 'development') == 'production'
        
        response.delete_cookie(
            key="session_token",
            path="/",
            secure=is_production,
            samesite="none" if is_production else "lax"
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


@router.post("/complete-onboarding", response_model=APIResponse)
async def complete_onboarding(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Mark user onboarding as complete and update user name"""
    try:
        from auth import get_current_user
        user = await get_current_user(request, db)
        
        # Get name from request body if provided
        body = await request.json()
        name = body.get("name") if body else None
        
        # Update user onboarding status and name
        update_data = {"onboarding_completed": True}
        if name:
            update_data["name"] = name
        
        await db.users.update_one(
            {"id": user.id},
            {"$set": update_data}
        )
        
        return APIResponse(
            success=True,
            message="Onboarding completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing onboarding: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error completing onboarding"
        )