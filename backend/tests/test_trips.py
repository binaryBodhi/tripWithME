import pytest
from datetime import datetime, timedelta, timezone
from backend.models.trips import Trip
from backend.models.notifications import Notification

@pytest.mark.asyncio
async def test_create_trip(client, create_user_helper):
    user, token = await create_user_helper()
    headers = {"Authorization": f"Bearer {token}"}
    
    departure_date = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    trip_data = {
        "from_location": "A",
        "to_location": "B",
        "departure_date": departure_date
    }
    
    response = await client.post("/trips/create_trip", json=trip_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["from_location"] == "A"
    assert data["creator_id"] == str(user.id)
    
    # Verify in DB
    trip = await Trip.find_one(Trip.from_location == "A")
    assert trip is not None
    assert trip.creator_id == user.id

@pytest.mark.asyncio
async def test_join_trip_request(client, create_user_helper):
    # Creator
    creator, _ = await create_user_helper(email="creator@example.com")
    
    # Trip
    trip = Trip(
        creator_id=creator.id,
        from_location="X",
        to_location="Y",
        departure_date=datetime.now(timezone.utc) + timedelta(days=1),
        status="created"
    )
    await trip.insert()
    
    # Passenger
    passenger, p_token = await create_user_helper(email="passenger@example.com")
    headers = {"Authorization": f"Bearer {p_token}"}
    
    response = await client.post(f"/trips/{trip.id}/join", headers=headers)
    assert response.status_code == 200
    
    # Verify trip state
    updated_trip = await Trip.get(trip.id)
    assert passenger.id in updated_trip.pending_passengers
    
    # Verify notification created for creator
    notif = await Notification.find_one(Notification.recipient_id == creator.id)
    assert notif is not None
    assert notif.type == "join_request"
    assert notif.sender_id == passenger.id

@pytest.mark.asyncio
async def test_accept_join_request(client, create_user_helper):
    # Creator
    creator, c_token = await create_user_helper(email="c@example.com")
    c_headers = {"Authorization": f"Bearer {c_token}"}
    
    # Passenger
    passenger, _ = await create_user_helper(email="p@example.com")
    
    # Trip with pending passenger
    trip = Trip(
        creator_id=creator.id,
        from_location="Start",
        to_location="End",
        departure_date=datetime.now(timezone.utc) + timedelta(days=1),
        status="created",
        pending_passengers=[passenger.id]
    )
    await trip.insert()
    
    # Notification to handle
    notif = Notification(
        recipient_id=creator.id,
        sender_id=passenger.id,
        type="join_request",
        trip_id=trip.id,
        title="Join Request",
        message="Let me join"
    )
    await notif.insert()
    
    # Accept via trip accept endpoint
    response = await client.post(f"/trips/{trip.id}/accept_join/{passenger.id}", headers=c_headers)
    assert response.status_code == 200
    
    # Mark notification as handled
    response = await client.patch(f"/notifications/{notif.id}/handle", headers=c_headers)
    assert response.status_code == 200
    
    # Verify trip state
    updated_trip = await Trip.get(trip.id)
    assert passenger.id in updated_trip.passengers
    assert passenger.id not in updated_trip.pending_passengers
    
    # Verify notification marked as handled
    updated_notif = await Notification.get(notif.id)
    assert updated_notif.is_handled == True
    
    # Verify acceptance notification for passenger
    accept_notif = await Notification.find_one(
        Notification.recipient_id == passenger.id,
        Notification.type == "join_accept"
    )
    assert accept_notif is not None
