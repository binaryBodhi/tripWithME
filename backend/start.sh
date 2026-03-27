#!/bin/bash
# start.sh

# Exit on error
set -e

# Number of workers (use WEB_CONCURRENCY if set, else fallback to 1)
WORKERS=${WEB_CONCURRENCY:-1}
PORT=${PORT:-8000}

RELOAD_FLAG=""
if [ -z "$RENDER" ]; then
    echo "🛠️ Local environment detected. Enabling hot-reload."
    RELOAD_FLAG="--reload"
fi

echo "🚀 Starting FastAPI with Gunicorn ($WORKERS workers) on port $PORT"

exec python3 -m gunicorn.app.wsgiapp backend.main:app \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    $RELOAD_FLAG \
    --access-logfile - \
    --error-logfile -
