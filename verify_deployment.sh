#!/bin/bash
set -e

# 1. Build
echo "Building the application..."
npm run build

# 2. Deploy (Restart)
echo "Restarting the application..."
# Find and kill existing node build process
PIDS=$(pgrep -f "node build" || true)
if [ -n "$PIDS" ]; then
  echo "Killing existing processes: $PIDS"
  echo "$PIDS" | xargs kill || true
  sleep 5
fi

# Ensure port 3000 is free
if lsof -i :3000 > /dev/null; then
  echo "Port 3000 is still in use. Killing process on port 3000..."
  lsof -t -i :3000 | xargs kill -9 || true
  sleep 2
fi

# Start the new build in background
export PORT=3000
nohup node build > server.log 2>&1 &
NEW_PID=$!
echo "Started new process $NEW_PID on port $PORT"

# Wait for server to start
sleep 5

# 3. Verify
echo "Verifying deployment..."
BASE_URL="http://localhost:$PORT"

# Check main page for links (allow relative paths)
echo "Checking app.html content..."
CONTENT=$(curl -s "$BASE_URL")
echo "$CONTENT" | grep -q 'href=".*favicon-32x32.png?v=5"' && echo "Found 32x32 link" || { echo "Missing 32x32 link"; exit 1; }
echo "$CONTENT" | grep -q 'href=".*favicon-16x16.png?v=5"' && echo "Found 16x16 link" || { echo "Missing 16x16 link"; exit 1; }
echo "$CONTENT" | grep -q 'href=".*apple-touch-icon.png?v=5"' && echo "Found apple-touch-icon link" || { echo "Missing apple-touch-icon link"; exit 1; }

# Check assets
echo "Checking assets..."
# Note: curl might need -L if there are redirects, but usually static assets are direct.
# We use the filename directly appended to BASE_URL. If the HTML uses ./, it means relative to current URL.
curl -f -s -o /dev/null "$BASE_URL/favicon-32x32.png?v=5" && echo "favicon-32x32.png?v=5 is accessible" || { echo "Failed to fetch favicon-32x32.png?v=5"; exit 1; }
curl -f -s -o /dev/null "$BASE_URL/favicon-16x16.png?v=5" && echo "favicon-16x16.png?v=5 is accessible" || { echo "Failed to fetch favicon-16x16.png?v=5"; exit 1; }
curl -f -s -o /dev/null "$BASE_URL/apple-touch-icon.png?v=5" && echo "apple-touch-icon.png?v=5 is accessible" || { echo "Failed to fetch apple-touch-icon.png?v=5"; exit 1; }

echo "Verification successful!"
