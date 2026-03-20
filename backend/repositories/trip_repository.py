from backend.models.trips import Trip
from beanie import PydanticObjectId
from typing import List, Optional
import datetime
import re

async def create_trip(trip: Trip) -> Trip:
    await trip.insert()
    return trip

async def get_trip_by_id(trip_id: str) -> Optional[Trip]:
    # Beanie handles PydanticObjectId conversion in get() if passed correctly, 
    # but being explicit is safer for string IDs from the front-end.
    try:
        oid = PydanticObjectId(trip_id)
    except:
        return None
    return await Trip.get(oid)

async def update_trip(trip: Trip) -> Trip:
    await trip.save()
    return trip



async def search_trips(query: Optional[str] = None) -> List[Trip]:
    # Return trips with status "created" and departure_date in the future
    now = datetime.datetime.now(datetime.timezone.utc)
    
    filters = [
        Trip.status == "created",
        Trip.departure_date > now
    ]
    
    if query:
        # Fuzzy matching for from_location or to_location
        regex_query = re.compile(query, re.IGNORECASE)
        filters.append((Trip.from_location == regex_query) | (Trip.to_location == regex_query))
        
    return await Trip.find(*filters).to_list()


async def get_user_previous_trips(user_id: PydanticObjectId) -> List[Trip]:
    """Retrieve all completed or cancelled trips where the user was the creator or a passenger."""
    return await Trip.find(
        {
            "$and": [
                {
                    "$or": [
                        {"creator_id": user_id},
                        {"passengers": user_id}
                    ]
                },
                {
                    "status": {"$in": ["completed", "cancelled"]}
                }
            ]
        }
    ).sort("-departure_date").to_list()