from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from enum import Enum


# Authentication Models
class SessionData(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    session_token: str


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    onboarding_completed: bool = False


class UserCreate(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None


class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True


# Profile Models
class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_experience: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    is_open_for_connection: bool = True
    contact_preferences: Optional[str] = None  # "email", "linkedin", "both"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserProfileCreate(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_experience: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    is_open_for_connection: bool = True
    contact_preferences: Optional[str] = "email"


class UserProfileUpdate(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_experience: Optional[int] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    is_open_for_connection: Optional[bool] = None
    contact_preferences: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_experience: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    is_open_for_connection: bool
    contact_preferences: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    # Include user data
    user_name: str
    user_email: str
    user_picture: Optional[str] = None


# Connection Models
class ConnectionStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted" 
    REJECTED = "rejected"
    BLOCKED = "blocked"


class ConnectionRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    receiver_id: str
    message: str
    status: ConnectionStatus = ConnectionStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    responded_at: Optional[datetime] = None


class ConnectionRequestCreate(BaseModel):
    receiver_id: str
    message: str


class ConnectionRequestResponse(BaseModel):
    status: ConnectionStatus


class ConnectionRequestDetail(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    message: str
    status: ConnectionStatus
    created_at: datetime
    responded_at: Optional[datetime] = None
    # Include sender/receiver profile data
    sender_name: str
    sender_email: str
    sender_picture: Optional[str] = None
    receiver_name: str
    receiver_email: str
    receiver_picture: Optional[str] = None


# Messaging Models
class Conversation(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user1_id: str
    user2_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_message_at: Optional[datetime] = None
    is_active: bool = True


class Message(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    content: str
    timestamp: datetime
    is_read: bool


class ConversationDetail(BaseModel):
    id: str
    user1_id: str
    user2_id: str
    created_at: datetime
    last_message_at: Optional[datetime] = None
    is_active: bool
    # Include other user's info
    other_user_name: str
    other_user_email: str
    other_user_picture: Optional[str] = None
    # Include last message preview
    last_message: Optional[str] = None
    unread_count: int = 0


# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None