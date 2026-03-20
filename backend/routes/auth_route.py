from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.models.users import User
from backend.auth.encrypt_password import verify_password
from backend.auth.token import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(payload: LoginRequest):
    user = await User.find_one(User.email == payload.email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }