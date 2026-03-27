from pydantic import BaseModel
from beanie import PydanticObjectId
from datetime import datetime

class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str
    password: str
    email: str
    phone_number: str

class UserLoginSchema(BaseModel):
    password: str
    email: str
    
class UserUpdateDetailsSchema(BaseModel):
    dob: datetime | None = None
    gender: str | None = None
    

class UserResponseSchema(BaseModel):
    id: PydanticObjectId
    first_name: str
    last_name: str
    age: int | None = None
    gender: str | None = None

    email: str
    phone_number: str | None = None

    is_active: bool
    created_at: datetime | None = None
    updated_at: str | None = None