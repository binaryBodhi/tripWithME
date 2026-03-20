from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from backend.schemas import trip_schema
from backend.controller import trip_controller
from backend.models.users import User
from backend.auth.dependencies import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/create_trip", status_code=status.HTTP_201_CREATED, response_model=trip_schema.TripResponseSchema)
async def create_trip(payload: trip_schema.TripCreateSchema, current_user: User = Depends(get_current_user)):
    return await trip_controller.create_trip(payload, current_user)

@router.get("/", response_model=List[trip_schema.TripResponseSchema])
async def search_trips(q: str = None, current_user: User = Depends(get_current_user)):
    return await trip_controller.search_trips(q)

@router.get("/previous", response_model=List[trip_schema.TripResponseSchema])
async def get_previous_trips(current_user: User = Depends(get_current_user)):
    return await trip_controller.get_previous_trips(current_user)

@router.get("/{trip_id}", response_model=trip_schema.TripResponseSchema)
async def get_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.get_trip_by_id(trip_id)

@router.post("/{trip_id}/join", response_model=trip_schema.TripResponseSchema)
async def join_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.join_trip(trip_id, current_user)

@router.post("/{trip_id}/leave", response_model=trip_schema.TripResponseSchema)
async def leave_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.leave_trip(trip_id, current_user)

@router.post("/{trip_id}/cancel", response_model=trip_schema.TripResponseSchema)
async def cancel_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.cancel_trip(trip_id, current_user)

@router.post("/{trip_id}/complete", response_model=trip_schema.TripResponseSchema)
async def complete_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.complete_trip(trip_id, current_user)

@router.post("/{trip_id}/accept_join/{user_id}", response_model=trip_schema.TripResponseSchema)
async def accept_join(trip_id: str, user_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.accept_join(trip_id, user_id, current_user)

@router.post("/{trip_id}/reject_join/{user_id}", response_model=trip_schema.TripResponseSchema)
async def reject_join(trip_id: str, user_id: str, current_user: User = Depends(get_current_user)):
    return await trip_controller.reject_join(trip_id, user_id, current_user)
