# HTTP Layer imports
import datetime
from fastapi import HTTPException, status
from typing import List

# DB Layer imports
from beanie import PydanticObjectId
from backend.models.trips import Trip
from backend.models.users import User
from backend.models.notifications import Notification
from backend.repositories import trip_repository, notification_repository

# Schema imports
from backend.schemas import trip_schema


async def enrich_trip(trip: Trip, current_user: User = None) -> Trip:
    """Enrich a trip with creator name and pending passenger details for serialization."""
    creator = await User.get(trip.creator_id)
    if creator:
        trip.creator_name = f"{creator.first_name} {creator.last_name}"
        if current_user and (current_user.id == creator.id or current_user.id in trip.passengers):
            trip.creator_phone = creator.phone_number
    
    enriched_pending = []
    for p_id in trip.pending_passengers:
        if isinstance(p_id, dict):
            enriched_pending.append(p_id)
            continue
        user = await User.get(p_id)
        if user:
            enriched_pending.append({
                "id": str(user.id),
                "name": f"{user.first_name} {user.last_name}"
            })
    trip.pending_passengers = enriched_pending
    return trip


async def create_trip(payload: trip_schema.TripCreateSchema, current_user: User):
    try:
        trip = Trip(
            creator_id=current_user.id,
            passengers=[current_user.id],
            pending_passengers=[],
            from_location=payload.from_location,
            to_location=payload.to_location,
            departure_date=payload.departure_date
        )
        await trip_repository.create_trip(trip)
        
        # Notify others if needed (e.g. if we add invite logic later)
        return trip
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Trip creation failed",
        ) from e


async def join_trip(trip_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.status != "created":
        raise HTTPException(status_code=400, detail="Cannot join this trip")

    if current_user.id in trip.passengers or current_user.id in trip.pending_passengers:
        return trip

    trip.pending_passengers.append(current_user.id)
    await trip_repository.update_trip(trip)
    
    # Create notification for creator
    notif = Notification(
        recipient_id=trip.creator_id,
        sender_id=current_user.id,
        type="join_request",
        title="New Join Request",
        message=f"{current_user.first_name} wants to join your trip from {trip.from_location} to {trip.to_location}",
        trip_id=trip.id
    )
    await notification_repository.create_notification(notif)
    
    return await enrich_trip(trip, current_user)


async def accept_join(trip_id: str, user_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can accept requests")
    
    u_id = PydanticObjectId(user_id)
    
    if u_id not in trip.pending_passengers:
        raise HTTPException(status_code=400, detail="User hasn't requested to join")
    
    trip.pending_passengers.remove(u_id)
    if u_id not in trip.passengers:
        trip.passengers.append(u_id)
    
    await trip_repository.update_trip(trip)
    
    # Notify user
    notif = Notification(
        recipient_id=u_id,
        sender_id=current_user.id,
        type="join_accept",
        title="Join Request Accepted",
        message=f"Your request to join the trip to {trip.to_location} was accepted!",
        trip_id=trip.id
    )
    await notification_repository.create_notification(notif)
    
    return await enrich_trip(trip, current_user)


async def reject_join(trip_id: str, user_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can reject requests")
    
    u_id = PydanticObjectId(user_id)
    
    if u_id in trip.pending_passengers:
        trip.pending_passengers.remove(u_id)
        await trip_repository.update_trip(trip)
    
    # Silent rejection - no notification
    return await enrich_trip(trip, current_user)


async def leave_trip(trip_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if current_user.id not in trip.passengers:
        return await enrich_trip(trip, current_user)

    trip.passengers.remove(current_user.id)
    await trip_repository.update_trip(trip)
    
    # Notify creator
    notif = Notification(
        recipient_id=trip.creator_id,
        sender_id=current_user.id,
        type="leave",
        title="Member Left Trip",
        message=f"{current_user.first_name} left your trip to {trip.to_location}",
        trip_id=trip.id
    )
    await notification_repository.create_notification(notif)
    
    return await enrich_trip(trip, current_user)


async def cancel_trip(trip_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can cancel a trip")

    trip.status = "cancelled"
    await trip_repository.update_trip(trip)
    
    # Notify all passengers
    for p_id in trip.passengers:
        if p_id != current_user.id:
            notif = Notification(
                recipient_id=p_id,
                sender_id=current_user.id,
                type="cancel",
                title="Trip Cancelled",
                message=f"The trip from {trip.from_location} to {trip.to_location} was cancelled by the creator.",
                trip_id=trip.id
            )
            await notification_repository.create_notification(notif)
            
    return await enrich_trip(trip, current_user)


async def complete_trip(trip_id: str, current_user: User) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can complete a trip")

    trip.status = "completed"
    trip.completed_at = datetime.datetime.utcnow()
    await trip_repository.update_trip(trip)
    
    # Notify all passengers
    for p_id in trip.passengers:
        if p_id != current_user.id:
            notif = Notification(
                recipient_id=p_id,
                sender_id=current_user.id,
                type="complete",
                title="Trip Completed",
                message=f"Safe travels! The trip to {trip.to_location} has been marked as completed.",
                trip_id=trip.id
            )
            await notification_repository.create_notification(notif)
            
    return await enrich_trip(trip, current_user)


async def search_trips(query: str = None, current_user: User = None) -> List[Trip]:
    trips = await trip_repository.search_trips(query)
    enriched = []
    for trip in trips:
        enriched.append(await enrich_trip(trip, current_user))
    return enriched


async def get_trip_by_id(trip_id: str, current_user: User = None) -> Trip:
    trip = await trip_repository.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return await enrich_trip(trip, current_user)


async def get_previous_trips(current_user: User) -> List[Trip]:
    trips = await trip_repository.get_user_previous_trips(current_user.id)
    enriched = []
    for trip in trips:
        enriched.append(await enrich_trip(trip, current_user))
    return enriched
