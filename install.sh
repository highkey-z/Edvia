#!/bin/bash

echo "🚀 Setting up Reading Companion..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating .env file..."
    cp server/env.example server/.env
    echo "⚠️  Please edit server/.env and add your OpenAI API key!"
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your OpenAI API key"
echo "2. Run 'npm run dev' to start the application"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy reading! 📚"



