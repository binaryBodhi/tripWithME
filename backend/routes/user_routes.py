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
        sex = createdUser.sex,
        email = createdUser.email,
        phone_number = createdUser.phone_number,
        is_active= createdUser.is_active,
        created_at= createdUser.created_at,
        updated_at= createdUser.updated_at
    )

@router.get("/me", response_model=user_schema.UserResponseSchema)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/update_me", response_model=user_schema.UserResponseSchema)
async def update_me(data: dict, current_user: User = Depends(get_current_user)):
    return await user_controller.update_user(current_user, data)



# @router.get("/{user_id}")
# async def get_user(user_id: str):
#     user = await User.get(user_id)
#     if not user:
#         raise HTTPException(404, "User not found")
#     return user
