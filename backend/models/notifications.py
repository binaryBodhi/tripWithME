from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional, Annotated


class Notification(Document):
    recipient_id: Annotated[PydanticObjectId, Indexed()]
    sender_id: Optional[PydanticObjectId] = None
    
    # Types: join_request, join_accept, leave, cancel, complete
    type: str
    title: str
    message: str
    trip_id: Optional[PydanticObjectId] = None
    
    is_read: bool = Field(default=False)
    is_handled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "notifications"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "recipient_id": "64b8f2e9f1a4e8c123456789",
                "type": "join_request",
                "title": "New Join Request",
                "message": "Alice wants to join your trip to Boston",
                "trip_id": "64b8f2e9f1a4e8c123456780",
                "is_read": False
            }
        }
    )
