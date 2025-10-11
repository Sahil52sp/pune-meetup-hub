"""
Script to import test user data into MongoDB database
Run this to populate the database with test profiles for the Browse Connections feature
"""
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# Load environment variables
backend_dir = Path(__file__).parent / 'backend'
load_dotenv(backend_dir / '.env')

# MongoDB connection - Force Atlas only
ATLAS_URL = "mongodb+srv://PuneMeetupAdmin:PuneMeetupAdmin@punemeetupsinitial.ntwdrrb.mongodb.net/pune_meetup_hub?retryWrites=true&w=majority"
mongo_url = os.environ.get('MONGO_URL', ATLAS_URL)
db_name = os.environ.get('DB_NAME', 'pune_meetup_hub')

print(f"Connecting to MongoDB at: {mongo_url}")
print(f"Database: {db_name}")

def convert_mongodb_json(obj):
    """Convert MongoDB Extended JSON to regular Python objects"""
    if isinstance(obj, dict):
        # Convert $oid to string
        if '$oid' in obj:
            return obj['$oid']
        # Convert $date to datetime
        if '$date' in obj:
            date_str = obj['$date']
            if isinstance(date_str, str):
                return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return datetime.fromtimestamp(date_str / 1000)
        # Recursively process dictionary
        return {k: convert_mongodb_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_mongodb_json(item) for item in obj]
    return obj

async def import_data():
    """Import test users and profiles into MongoDB"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("\n" + "="*60)
    print("Starting data import...")
    print("="*60 + "\n")
    
    # Import users
    users_file = Path(__file__).parent / 'mongodb_backup' / 'json_export' / 'users.json'
    print(f"Reading users from: {users_file}")
    
    with open(users_file, 'r', encoding='utf-8') as f:
        users_raw = json.load(f)
    
    # Convert MongoDB Extended JSON to regular Python objects
    users = [convert_mongodb_json(user) for user in users_raw]
    
    print(f"   Found {len(users)} users to import")
    
    # Clear existing test users (optional - keep real users)
    # We'll use upsert to avoid duplicates
    for i, user in enumerate(users, 1):
        result = await db.users.update_one(
            {'id': user['id']},
            {'$set': user},
            upsert=True
        )
        if result.upserted_id:
            print(f"   [+] Inserted user {i}/{len(users)}: {user['name']}")
        else:
            print(f"   [*] Updated user {i}/{len(users)}: {user['name']}")
    
    # Import user profiles
    profiles_file = Path(__file__).parent / 'mongodb_backup' / 'json_export' / 'user_profiles.json'
    print(f"\nReading profiles from: {profiles_file}")
    
    with open(profiles_file, 'r', encoding='utf-8') as f:
        profiles_raw = json.load(f)
    
    # Convert MongoDB Extended JSON to regular Python objects
    profiles = [convert_mongodb_json(profile) for profile in profiles_raw]
    
    print(f"   Found {len(profiles)} profiles to import")
    
    for i, profile in enumerate(profiles, 1):
        result = await db.user_profiles.update_one(
            {'id': profile['id']},
            {'$set': profile},
            upsert=True
        )
        if result.upserted_id:
            print(f"   [+] Inserted profile {i}/{len(profiles)}: {profile.get('job_title', 'N/A')} at {profile.get('company', 'N/A')}")
        else:
            print(f"   [*] Updated profile {i}/{len(profiles)}: {profile.get('job_title', 'N/A')} at {profile.get('company', 'N/A')}")
    
    # Verify import
    print("\n" + "="*60)
    print("Verifying import...")
    print("="*60 + "\n")
    
    users_count = await db.users.count_documents({})
    profiles_count = await db.user_profiles.count_documents({})
    open_for_connection = await db.user_profiles.count_documents({'is_open_for_connection': True})
    
    print(f"[*] Total users in database: {users_count}")
    print(f"[*] Total profiles in database: {profiles_count}")
    print(f"[*] Profiles open for connection: {open_for_connection}")
    
    # Show sample of profiles with location
    pune_profiles = await db.user_profiles.count_documents({'location': 'Pune'})
    print(f"[*] Profiles in Pune: {pune_profiles}")
    
    print("\n" + "="*60)
    print("[SUCCESS] Import completed successfully!")
    print("="*60 + "\n")
    print("You can now browse connections at /browse page")
    
    client.close()

if __name__ == "__main__":
    try:
        asyncio.run(import_data())
    except Exception as e:
        print(f"\n[ERROR] Error during import: {e}")
        print(f"   Make sure MongoDB is running at: {mongo_url}")
        exit(1)

