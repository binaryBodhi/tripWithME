from pydantic import BaseModel, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime
from typing import Optional, List


class NotificationResponse(BaseModel):
    id: PydanticObjectId
    recipient_id: PydanticObjectId
    sender_id: Optional[PydanticObjectId] = None
    type: str
    title: str
    message: str
    trip_id: Optional[PydanticObjectId] = None
    is_read: bool
    is_handled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationList(BaseModel):
    notifications: List[NotificationResponse]
