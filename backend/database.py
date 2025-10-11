from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")
if not db_name:
    raise ValueError("DB_NAME environment variable is required")

print(f"🔗 Connecting to MongoDB: {mongo_url[:50]}...")
print(f"📁 Using database: {db_name}")

client = AsyncIOMotorClient(mongo_url)
database = client[db_name]

def get_database() -> AsyncIOMotorDatabase:
    return database