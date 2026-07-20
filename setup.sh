#!/bin/bash

# Vote Management System - Setup Script
# This script helps you set up the project with Supabase

echo "🚀 Vote Management System - Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping..."
else
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "📝 Please update .env.local with your Supabase credentials:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Go to https://supabase.com and create a new project"
echo "2. Copy the schema from supabase/schema.sql"
echo "3. Run it in the Supabase SQL Editor"
echo "4. Update .env.local with your Supabase credentials"
echo "5. Run 'npm run dev' to start the development server"
echo ""
