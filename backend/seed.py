import asyncio
import random
import os
import sys
from datetime import datetime, timezone, timedelta

# Ensure 'backend' module is recognized when running from terminal
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.db_connection import init_db
from backend.models.users import User
from backend.models.trips import Trip
from backend.auth.encrypt_password import hash_password

INDIAN_CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"]
UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]
NAMES = [
    ("Aarav", "Patel"), ("Vivaan", "Sharma"), ("Aditya", "Singh"), ("Vihaan", "Kumar"),
    ("Arjun", "Rao"), ("Sai", "Nair"), ("Iyaan", "Deshmukh"), ("Ali", "Al Mansoori"),
    ("Omar", "Al Suwaidi"), ("Mohammed", "Al Hashmi"), ("Fatima", "Al Ketbi"),
    ("Priya", "Gupta"), ("Ananya", "Reddy"), ("Diya", "Joshi"), ("Sara", "Al Maktoum")
]

async def seed_db():
    print("⏳ Initializing Database connection...")
    await init_db()
    
    print("🧹 Clearing existing data...")
    await User.delete_all()
    await Trip.delete_all()
    
    print("👥 Seeding 10 Users...")
    users_to_insert = []
    
    for i in range(10):
        first_name, last_name = random.choice(NAMES)
        email = f"user{i+1}@example.com"
        
        # Alternate phone numbers styles randomly
        phone_number = f"+97150{random.randint(1000000, 9999999)}" if random.choice([True, False]) else f"+9198{random.randint(10000000, 99999999)}"
        
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hash_password("password123"),
            phone_number=phone_number,
            is_active=True
        )
        users_to_insert.append(user)
        
    await User.insert_many(users_to_insert)
    
    # Re-fetch users specifically to get their true DB ObjectIds for references
    created_users = await User.find_all().to_list()
    print(f"✅ {len(created_users)} Users created successfully! (Login: user1@example.com -> user10@example.com / Password: password123)")
    
    print("🚗 Seeding 50 Trips (Strictly Domestic)...")
    trips_to_insert = []
    
    for i in range(50):
        creator = random.choice(created_users)
        
        # Decide if this is a domestic Indian trip or a domestic UAE trip
        country = random.choice(["India", "UAE"])
        if country == "India":
            cities = random.sample(INDIAN_CITIES, 2)
        else:
            cities = random.sample(UAE_CITIES, 2)
            
        from_loc, to_loc = cities[0], cities[1]
        
        # Random departure between 1 and 30 days from now
        days_ahead = random.randint(1, 30)
        hours_ahead = random.randint(0, 23)
        dep_date = datetime.now(timezone.utc) + timedelta(days=days_ahead, hours=hours_ahead)
        
        trip = Trip(
            creator_id=creator.id,
            creator_name=f"{creator.first_name} {creator.last_name}",
            from_location=from_loc,
            to_location=to_loc,
            departure_date=dep_date,
            passengers=[creator.id],  # Creator is usually the first passenger mathematically
            status="created"
        )
        trips_to_insert.append(trip)
        
    await Trip.insert_many(trips_to_insert)
    print(f"✅ {len(trips_to_insert)} Trips created successfully!")
    print("🎯 Database seeding exactly as specified completed!")

if __name__ == "__main__":
    asyncio.run(seed_db())
