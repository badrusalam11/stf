@echo off
REM Build Docker image
docker build -t custom/stf .

REM Shut down the container using docker-compose
docker-compose down

REM Rebuild the containers with docker-compose
docker-compose build

REM Start the containers with docker-compose
docker-compose up

pause
