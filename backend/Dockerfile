# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

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

# Expose port (Render will set PORT environment variable)
EXPOSE 10000

# Run the application with memory-optimized settings for free tier
CMD ["java", "-Xmx256m", "-Xms128m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=128m", "-Dserver.port=${PORT}", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"] 