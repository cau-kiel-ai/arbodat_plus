# Stage 1: Build
FROM gradle:8.8-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build --no-build-cache

# Stage 2: Run
FROM eclipse-temurin:17-jdk
COPY --from=build /app/build/libs/*.jar /web-api.jar
ENTRYPOINT ["java", "-jar", "/web-api.jar"]
EXPOSE 8080