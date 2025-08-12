#!/bin/bash

# Wait for PostgreSQL to be ready
HOST=${1:-localhost}
PORT=${2:-5440}
USER=${3:-postgres}

echo "Waiting for PostgreSQL at $HOST:$PORT..."

# Wait up to 30 seconds for the database to be ready
for i in {1..30}; do
    if pg_isready -h $HOST -p $PORT -U $USER > /dev/null 2>&1; then
        echo "PostgreSQL is ready!"
        exit 0
    fi
    echo "Waiting for PostgreSQL... ($i/30)"
    sleep 1
done

echo "PostgreSQL did not become ready in time"
exit 1