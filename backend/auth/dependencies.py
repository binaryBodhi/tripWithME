from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from backend.auth.jwt import SECRET_KEY, ALGORITHM
from backend.models.users import User
from beanie import PydanticObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
