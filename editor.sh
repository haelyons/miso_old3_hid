#!/bin/bash

# Miso Editor Launcher
# Starts the Flask server from the correct directory for proper path resolution

echo "🍜 Starting Miso Editor..."
echo "🔍 Checking for existing processes on port 5000..."

# Kill any existing python process using port 5000
EXISTING_PID=$(lsof -ti:5000 -c python 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "🛑 Killing existing Python process on port 5000 (PID: $EXISTING_PID)"
    kill $EXISTING_PID
    sleep 1
else
    echo "✅ Port 5000 is free"
fi

echo "📂 Running from miso root directory for correct spec/ path resolution"
echo "🌐 Editor will be available at: http://localhost:5000"
echo ""

# Start Flask server from miso root directory in a new terminal
osascript -e "tell app \"Terminal\" to do script \"cd '$(pwd)' && python3 spec/miso/.editor/code/app.py\""