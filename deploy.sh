#!/bin/bash

# Build Docker image
docker build -t custom/stf .

# Shut down the container using docker-compose
docker-compose down

# Rebuild the containers with docker-compose
docker-compose build

# Start the containers with docker-compose
docker-compose up
