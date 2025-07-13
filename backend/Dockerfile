# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Install curl and netcat for health checks and database connectivity testing
RUN apt-get update && apt-get install -y curl netcat-traditional && rm -rf /var/lib/apt/lists/*

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x ./gradlew

# Copy source code
COPY src src

# Build the application
RUN ./gradlew build -x test --no-daemon

# Copy the wait script
COPY wait-for-db.sh .
RUN chmod +x wait-for-db.sh

# Expose port (Render will set PORT environment variable)
EXPOSE 8080

# Run the wait script which will start the application when database is ready
CMD ["./wait-for-db.sh"] 