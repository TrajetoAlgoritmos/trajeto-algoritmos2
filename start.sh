#!/bin/bash

# Stop all running containers
docker compose down

# Start the specified services (db and redis)
docker compose up -d db redis
sleep 10s

# Start the mysql service
docker compose up -d mysql
sleep 15s

# Start all services defined in the docker-compose file
docker compose up --build -d
sleep 5s