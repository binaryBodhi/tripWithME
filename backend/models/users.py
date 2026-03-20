from beanie import Document, Indexed
from pydantic import EmailStr, Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional, Annotated


class User(Document):
    # Basic identity
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    age: Optional[str] = None
    sex: Optional[str] = None

    # Auth / contact
    email: Annotated[EmailStr, Indexed(unique=True)]
    phone_number: Optional[str] = None

    #password
    password: str

    # App-specific
    is_active: bool = True

    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

    class Settings:
        name = "users"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "Alice",
                "last_name": "Smith",
                "email": "alice@example.com",
                "phone_number": "+1234567890",
                "password": "hashedpasswordhere",
                "is_driver": False
            }
        }
    )
