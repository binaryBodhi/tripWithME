import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from contextlib import asynccontextmanager
from backend.db_connection import init_db

from backend.routes.auth_route import router as auth_router
from backend.routes.test_route import router as test_router
from backend.routes.user_routes import router as user_router
from backend.routes.trip_routes import router as trip_router
from backend.routes.notification_routes import router as notification_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [url.strip() for url in frontend_url.split(",") if url.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(test_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(trip_router)
app.include_router(notification_router)


@app.get("/")
async def health():
    return {"status": "ok"}
