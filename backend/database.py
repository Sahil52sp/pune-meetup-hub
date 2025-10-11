from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os

# HARDCODED Atlas connection - NO localhost allowed
ATLAS_URL = "mongodb+srv://PuneMeetupAdmin:PuneMeetupAdmin@punemeetupsinitial.ntwdrrb.mongodb.net/pune_meetup_hub?retryWrites=true&w=majority"
ATLAS_DB_NAME = "pune_meetup_hub"

print(f"🔗 PRODUCTION Atlas Connection: {ATLAS_URL[:60]}...")
print(f"📁 Using ATLAS Database: {ATLAS_DB_NAME}")

# Create connection to Atlas ONLY
client = AsyncIOMotorClient(ATLAS_URL, serverSelectionTimeoutMS=10000)
database = client[ATLAS_DB_NAME]

def get_database() -> AsyncIOMotorDatabase:
    return database