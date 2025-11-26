#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Deploying certificates to /etc/nginx/ssl/..."

# Copy certificates to Nginx SSL directory
sudo cp "$PROJECT_ROOT/certs/starlighterp.key" /etc/nginx/ssl/
sudo cp "$PROJECT_ROOT/certs/starlighterp.crt" /etc/nginx/ssl/

# Set permissions
sudo chmod 600 /etc/nginx/ssl/starlighterp.key
sudo chmod 644 /etc/nginx/ssl/starlighterp.crt

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Nginx certificates updated and service restarted."
echo "IMPORTANT: Please also restart your Vite dev server to pick up the changes on port 5173."
