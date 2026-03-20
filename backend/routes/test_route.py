# backend/routes/test.py
from fastapi import APIRouter, Depends
from backend.auth.encrypt_password import hash_password
from backend.models.users import User
from backend.models.trips import Trip
from backend.auth.dependencies import get_current_user

from beanie import PydanticObjectId

router = APIRouter(prefix="/test", tags=["Test"])

@router.post("/create-user")
async def create_user():
    password = "super-secret"
    print("PASSWORD:", password),
    print("TYPE:", type(password))
    print("LENGTH (chars):", len(password))
    print("LENGTH (bytes):", len(password.encode("utf-8")))

    user = User(
        first_name="Alice",
        last_name="Smith",
        email="alice@example1.com",
        password = "supersecret",
        hashed_password=hash_password("super-secret"),
    )

    await user.insert()
    return user

@router.post("/create-trip/")
async def create_trip(current_user: User = Depends(get_current_user)):
    trip = Trip(
        trip_creator_id=current_user.id,
        passengers=[current_user.id]
    )
    await trip.insert()
    return trip
