from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Force connection to Atlas only - NO fallbacks to local
ATLAS_URL = "mongodb+srv://PuneMeetupAdmin:PuneMeetupAdmin@punemeetupsinitial.ntwdrrb.mongodb.net/pune_meetup_hub?retryWrites=true&w=majority"
ATLAS_DB_NAME = "pune_meetup_hub"

mongo_url = os.environ.get('MONGO_URL', ATLAS_URL)
db_name = os.environ.get('DB_NAME', ATLAS_DB_NAME)

# Ensure we're using Atlas
if "localhost" in mongo_url or "127.0.0.1" in mongo_url:
    print("❌ BLOCKING localhost connection! Using Atlas instead.")
    mongo_url = ATLAS_URL
    db_name = ATLAS_DB_NAME

print(f"🔗 FORCED Atlas Connection: {mongo_url[:60]}...")
print(f"📁 Using Atlas Database: {db_name}")

# Create fresh connection
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
database = client[db_name]

def get_database() -> AsyncIOMotorDatabase:
    return database