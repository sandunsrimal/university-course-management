#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."

# Maximum wait time in seconds (5 minutes)
MAX_WAIT=300
WAIT_TIME=0

# Check if database environment variables are set
if [ -z "$MYSQL_HOST" ] || [ -z "$MYSQL_PORT" ] || [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ]; then
    echo "Database environment variables not set. Waiting 60 seconds for them to be available..."
    sleep 60
fi

# Function to check if database is ready
check_db() {
    echo "Checking database connection at $MYSQL_HOST:$MYSQL_PORT..."
    
    # Use netcat to check if the database port is open
    nc -z -w5 "$MYSQL_HOST" "$MYSQL_PORT" 2>/dev/null
    return $?
}

# Wait for database to be ready
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if check_db; then
        echo "Database port is open! Waiting additional 10 seconds for database to be fully ready..."
        sleep 10
        echo "Database should be ready now!"
        break
    else
        echo "Database not ready yet. Waiting 10 seconds... ($WAIT_TIME/$MAX_WAIT)"
        sleep 10
        WAIT_TIME=$((WAIT_TIME + 10))
    fi
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo "Database was not ready within $MAX_WAIT seconds. Starting application anyway..."
else
    echo "Database is ready. Starting application..."
fi

# Print environment variables for debugging (without sensitive info)
echo "Starting application with:"
echo "MYSQL_HOST: $MYSQL_HOST"
echo "MYSQL_PORT: $MYSQL_PORT"
echo "MYSQL_DATABASE: $MYSQL_DATABASE"
echo "MYSQL_USER: $MYSQL_USER"
echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"

# Start the Spring Boot application
exec java -jar build/libs/backend-0.0.1-SNAPSHOT.jar 