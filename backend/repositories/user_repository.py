from backend.models.users import User

async def get_user_by_email(email: str) -> User | None:
    return await User.find_one(User.email == email)

async def create_user(user: User) -> User:
    await user.insert()
    return user

async def update_user(user: User, data: dict) -> User:
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    await user.save()
    return user