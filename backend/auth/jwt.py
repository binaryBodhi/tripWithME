import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET", "default_secret_key_for_dev_only")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
