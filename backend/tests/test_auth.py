import pytest
from backend.models.users import User

@pytest.mark.asyncio
async def test_create_user(client):
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "password123",
        "age": "25",
        "sex": "male",
        "phone_number": "1234567890"
    }
    response = await client.post("/users/create_user", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    
    # Verify in DB
    user = await User.find_one(User.email == "test@example.com")
    assert user is not None
    assert user.first_name == "Test"

@pytest.mark.asyncio
async def test_login_user(client):
    # First create a user manually in the mock DB
    from backend.auth.encrypt_password import hash_password
    user = User(
        first_name="Login",
        last_name="Test",
        email="login@example.com",
        password=hash_password("password123"),
        is_active=True
    )
    await user.insert()
    
    login_data = {
        "email": "login@example.com",
        "password": "password123"
    }
    response = await client.post("/users/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["type"].lower() == "bearer"

@pytest.mark.asyncio
async def test_get_me(client):
    # Create user and get token
    from backend.auth.encrypt_password import hash_password
    from backend.auth.token import create_access_token
    user = User(
        first_name="Me",
        last_name="Test",
        email="me@example.com",
        password=hash_password("password123"),
        is_active=True
    )
    await user.insert()
    
    token = create_access_token({"sub": str(user.id)})
    headers = {"Authorization": f"Bearer {token}"}
    
    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["first_name"] == "Me"
