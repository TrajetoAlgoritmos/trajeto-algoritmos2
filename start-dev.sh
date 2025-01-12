#!/bin/bash

# Stop all running containers
sudo docker compose down

# Start the specified services (db and redis)
sudo docker compose up -d db redis
sleep 10s

# Start the mysql service
sudo docker compose up -d mysql
sleep 15s

# Start all services defined in the docker-compose file
sudo docker compose up --build
sleep 5s