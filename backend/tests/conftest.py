import pytest
import pytest_asyncio
import asyncio
import os
from httpx import AsyncClient, ASGITransport
from mongomock_motor import AsyncMongoMockClient
from beanie import init_beanie
from backend.main import app
from backend.models.users import User
from backend.models.trips import Trip
from backend.models.notifications import Notification

@pytest_asyncio.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(autouse=True)
async def mock_db():
    os.environ["TEST_MODE"] = "True"
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client["test_db"],
        document_models=[
            User,
            Trip,
            Notification
        ],
    )
    yield
    # No need to cleanup mock db explicitly for each test if using fresh client

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def create_user_helper():
    from backend.auth.encrypt_password import hash_password
    from backend.auth.token import create_access_token
    
    async def _create(email="test@example.com", first_name="Test"):
        user = User(
            first_name=first_name,
            last_name="User",
            email=email,
            password=hash_password("password123"),
            is_active=True
        )
        await user.insert()
        token = create_access_token({"sub": str(user.id)})
        return user, token
    
    return _create
