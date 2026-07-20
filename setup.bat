@echo off
echo 🚀 Vote Management System - Setup Script
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

if exist .env.local (
    echo ⚠️  .env.local already exists. Skipping...
) else (
    echo 📋 Creating .env.local from .env.example...
    copy .env.example .env.local
    echo ✅ .env.local created
    echo.
    echo 📝 Please update .env.local with your Supabase credentials:
    echo    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    echo    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    echo.
)

echo ✅ Setup complete!
echo.
echo 📚 Next steps:
echo 1. Go to https://supabase.com and create a new project
echo 2. Copy the schema from supabase/schema.sql
echo 3. Run it in the Supabase SQL Editor
echo 4. Update .env.local with your Supabase credentials
echo 5. Run 'npm run dev' to start the development server
echo.
pause
