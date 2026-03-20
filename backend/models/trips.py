from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field, ConfigDict, BaseModel
from datetime import datetime, timezone
from typing import List, Optional, Annotated


class Trip(Document):
    # Core relationships
    creator_id: Annotated[PydanticObjectId, Indexed()]
    passengers: List[PydanticObjectId] = Field(default_factory=list)
    pending_passengers: List[PydanticObjectId] = Field(default_factory=list)

    # Trip details
    from_location: str
    to_location: str
    departure_date: datetime
    creator_name: Optional[str] = None

    # Trip lifecycle
    status: str = Field(default="created")

    # Optional extensions
    driver_id: Optional[PydanticObjectId] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

    class Settings:
        name = "trips"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "creator_id": "64b8f2e9f1a4e8c123456789",
                "passengers": ["64b8f2e9f1a4e8c123456789"],
                "from_location": "New York",
                "to_location": "Boston",
                "departure_date": "2024-03-20T10:00:00Z",
                "status": "created"
            }
        }
    )
