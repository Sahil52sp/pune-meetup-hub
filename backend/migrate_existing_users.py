"""
Migration script to update existing users with onboarding_completed flag.
This ensures that existing users don't have to go through onboarding.
Run this once after deploying the onboarding feature.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def migrate_users():
    # Get MongoDB connection string
    mongodb_url = os.environ.get('MONGODB_URL', 'mongodb://localhost:27017')
    database_name = os.environ.get('DATABASE_NAME', 'meetup_network')
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongodb_url)
    db = client[database_name]
    
    print(f"Connected to MongoDB: {database_name}")
    
    # Find all users without onboarding_completed field
    users_without_field = await db.users.count_documents({
        "onboarding_completed": {"$exists": False}
    })
    
    print(f"Found {users_without_field} users without onboarding_completed field")
    
    if users_without_field > 0:
        # Update all existing users to have onboarding_completed=True
        result = await db.users.update_many(
            {"onboarding_completed": {"$exists": False}},
            {"$set": {"onboarding_completed": True}}
        )
        
        print(f"Updated {result.modified_count} users with onboarding_completed=True")
    else:
        print("No users need to be updated")
    
    # Close connection
    client.close()
    print("Migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(migrate_users())


