#!/bin/bash

# Portfolio Application Startup Script

echo "🚀 Starting Portfolio Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "🔍 Checking dependencies..."

# Start Backend Server
echo "🖥️  Starting Backend Server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "� Testing database connection and education data..."
node testEducationData.js

echo "�🔌 Starting backend on port 5000..."
npm start &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

# Start Frontend Server  
echo "🎨 Starting Frontend Server..."
cd ../client
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🌐 Starting frontend on port 3000..."
npm start &
FRONTEND_PID=$!

echo "✅ Application started successfully!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:5000"
echo "🔗 Admin Panel: http://localhost:3000/admin"

# Keep script running
echo "Press Ctrl+C to stop all servers..."
wait
