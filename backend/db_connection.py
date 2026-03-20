from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from backend.models.users import User
from backend.models.trips import Trip
from backend.models.notifications import Notification


import os
import certifi
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

# Load DB config from environment
MONGO_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "cab_booking_app"

async def init_db():
    if os.getenv("TEST_MODE") == "True":
        print("🛠️ Test mode active: Skipping real MongoDB connection.")
        return
    print(f"📡 Connecting to MongoDB: {'Cloud (Atlas)' if 'mongodb+srv' in MONGO_URI else 'Localhost'}")
    
    # Use certifi for SSL certificates on macOS/Cloud connections
    client = AsyncIOMotorClient(
        MONGO_URI,
        tlsCAFile=certifi.where() if "mongodb+srv" in MONGO_URI else None
    )
    await init_beanie(
        database=client[DB_NAME],
        document_models=[
            User,
            Trip,
            Notification
        ],
    )