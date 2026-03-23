#!/bin/bash
# start.sh

# Exit on error
set -e

# Number of workers (use WEB_CONCURRENCY if set, else fallback to 1)
WORKERS=${WEB_CONCURRENCY:-1}
PORT=${PORT:-8000}

echo "🚀 Starting FastAPI with Gunicorn ($WORKERS workers) on port $PORT"

exec gunicorn backend.main:app \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    --access-logfile - \
    --error-logfile -
