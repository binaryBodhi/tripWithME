from fastapi import APIRouter, HTTPException, status, Depends

from backend.schemas import user_schema
from backend.controller import user_controller
from backend.models.users import User
from backend.auth.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(payload: user_schema.UserLoginSchema):
    #request
    tokenObj = await user_controller.login(payload)
    
    #response
    return tokenObj

@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def create_user(user: user_schema.UserCreateSchema):
    #request
    createdUser = await user_controller.create_user(user)

    #response
    return user_schema.UserResponseSchema(
        id = createdUser.id,
        first_name= createdUser.first_name,
        last_name= createdUser.last_name,
        age= createdUser.age,
        gender= createdUser.gender,
        email = createdUser.email,
        phone_number = createdUser.phone_number,
        is_active= createdUser.is_active,
        created_at= createdUser.created_at,
        updated_at= str(createdUser.updated_at) if createdUser.updated_at else None
    )

@router.get("/me", response_model=user_schema.UserResponseSchema)
async def me(current_user: User = Depends(get_current_user)):
    return user_schema.UserResponseSchema(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        age=current_user.age,
        gender=current_user.gender,
        email=current_user.email,
        phone_number=current_user.phone_number,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=str(current_user.updated_at) if current_user.updated_at else None
    )

@router.put("/update_me", response_model=user_schema.UserResponseSchema)
async def update_me(data: user_schema.UserUpdateDetailsSchema, current_user: User = Depends(get_current_user)):
    updated_user = await user_controller.update_user(current_user, data.model_dump(exclude_unset=True))
    return user_schema.UserResponseSchema(
        id=updated_user.id,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        age=updated_user.age,
        gender=updated_user.gender,
        email=updated_user.email,
        phone_number=updated_user.phone_number,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        updated_at=str(updated_user.updated_at) if updated_user.updated_at else None
    )



# @router.get("/{user_id}")
# async def get_user(user_id: str):
#     user = await User.get(user_id)
#     if not user:
#         raise HTTPException(404, "User not found")
#     return user
