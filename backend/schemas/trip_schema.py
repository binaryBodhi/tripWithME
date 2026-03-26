from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime
from typing import List, Optional

class TripCreateSchema(BaseModel):
    from_location: str
    to_location: str
    departure_date: datetime

class TripResponseSchema(BaseModel):
    id: PydanticObjectId
    creator_id: PydanticObjectId
    creator_name: Optional[str] = None
    creator_phone: Optional[str] = None
    passengers: List[PydanticObjectId]
    pending_passengers: List[dict] = []
    from_location: str
    to_location: str
    departure_date: datetime
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    completed_at: datetime | None = None