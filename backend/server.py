from fastapi import FastAPI, APIRouter, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our route modules
from routes import auth_routes, profile_routes, connection_routes, messaging_routes

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import database
from database import get_database, database as db

# Create the main app without a prefix
app = FastAPI(title="Meetup Network API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Database dependency
async def get_database() -> AsyncIOMotorDatabase:
    return db


# Set up database dependency in route modules
auth_routes.get_database = get_database
profile_routes.get_database = get_database
connection_routes.get_database = get_database  
messaging_routes.get_database = get_database


# Define Models for existing functionality
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# Existing routes
@api_router.get("/")
async def root():
    return {"message": "Meetup Network API - Find Connections Feature"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# Include all route modules
api_router.include_router(auth_routes.router)
api_router.include_router(profile_routes.router)
api_router.include_router(connection_routes.router)
api_router.include_router(messaging_routes.router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
