#controller talks to the HTTP layer and the model layer

#HTTP Layer imports
from fastapi import HTTPException, status

#Auth imports
from backend.auth.encrypt_password import hash_password
from backend.auth.encrypt_password import verify_password
from backend.auth.token import create_access_token

#DB Layer imports
from backend.models.users import User
from backend.repositories import user_repository

#Schema imports
from backend.schemas import user_schema

async def login(payload: user_schema.UserLoginSchema):
    try:
        user = await user_repository.get_user_by_email(payload.email)

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(payload.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": str(user.id)})

        return {
            "token": token,
            "type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        # unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed",
        ) from e


async def create_user(userData: user_schema.UserCreateSchema):

    try:
        existing = await user_repository.get_user_by_email(userData.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = User(
            email=userData.email,
            password=hash_password(userData.password), # later: hash here
            age=userData.age,
            sex=userData.sex,
            phone_number=userData.phone_number,
            first_name=userData.first_name,
            last_name=userData.last_name,
        )

        return await user_repository.create_user(user)
    
    except HTTPException:
        raise
    except Exception as e:
        # unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        ) from e

async def update_user(current_user: User, update_data: dict):
    try:
        # Remove only None values, allow empty strings if they are sent deliberately
        filtered_data = {k: v for k, v in update_data.items() if v is not None}
        
        return await user_repository.update_user(current_user, filtered_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile",
        ) from e