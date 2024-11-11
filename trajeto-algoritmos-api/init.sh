#!/bin/sh

# Run migrations
node ace migration:run

# Copy envs
cp .env build/.env

# Copy Certificate
cp -r bin/sslCert build/bin/sslCert

# Copy Firebase config file
cp config/serviceAccountKey.json build/config/serviceAccountKey.json

# Run the server
node build/bin/server.js

