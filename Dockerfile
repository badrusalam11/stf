# Use the official Device Farmer STF image as the base
FROM devicefarmer/stf:latest

# Set a maintainer label
LABEL maintainer="Muhamad Badru Salam <badrusalam760@gmail.com>"

# Any additional configurations can be added here
COPY ./res ./res