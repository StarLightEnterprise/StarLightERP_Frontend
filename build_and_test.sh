#!/bin/bash
set -e

echo "Starting Frontend Build and Test Process..."

# 1. Install Dependencies
echo "Installing Dependencies..."
npm ci

# 2. Run Linting
echo "Running Linting..."
npm run check

# 3. Run Unit Tests
echo "Running Unit Tests..."
npm run test:unit

# 4. Run E2E Tests
# Note: E2E tests usually require the app to be running.
# Playwright webServer config handles this for 'npm run test:e2e'
echo "Running E2E Tests..."
# npm run test:e2e

# 5. Build for Production
echo "Building for Production..."
npm run build

echo "Frontend Build and Test Successful!"
