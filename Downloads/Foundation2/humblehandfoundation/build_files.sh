#!/bin/bash

# Exit on error
set -e

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Error handler
handle_error() {
    log_message "Error occurred in build script at line $1"
    exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

log_message "Starting build process..."

# Create necessary directories
log_message "Creating directories..."
mkdir -p staticfiles_build/static

# Install dependencies
log_message "Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Make migrations
log_message "Running migrations..."
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

# Collect static files
log_message "Collecting static files..."
python3 manage.py collectstatic --noinput --clear

# Verify static files
log_message "Verifying static files..."
if [ ! -d "staticfiles_build/static" ]; then
    log_message "Error: Static files directory not created"
    exit 1
fi

log_message "Build completed successfully!" 