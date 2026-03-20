from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime

class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str
    age: str | None = None
    sex: str | None = None

    password: str

    phone_number: str | None = None
    email: str

class UserLoginSchema(BaseModel):
    password: str
    email: str
    

class UserResponseSchema(BaseModel):
    id: PydanticObjectId
    first_name: str
    last_name: str
    age: str | None = None
    sex: str | None = None

    email: str
    phone_number: str | None = None

    is_active: bool
    created_at: datetime | None = None
    updated_at: str | None = None