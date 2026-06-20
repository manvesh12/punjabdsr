@echo off
setlocal EnableExtensions
cd /d "%~dp0..\.."

title Smart DSR Portal - Full Stack Start

echo.
echo Smart DSR Portal - Full Stack Start
echo ====================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

echo Setting up environment variables...
if not exist ".env" (
  copy ".env.example" ".env" >nul
)
if not exist "apps\api\.env" (
  copy ".env.example" "apps\api\.env" >nul
)
if not exist "apps\web\.env" (
  copy ".env.example" "apps\web\.env" >nul
)

if not exist "%~dp0node_modules\" (
  echo Initializing project and installing dependencies...
  echo This might take a few minutes for the first time.
  call npm install
  if errorlevel 1 (
    echo npm install failed. Please check your internet connection or npm setup.
    pause
    exit /b 1
  )
)

echo Starting Docker containers (Postgres, Redis, MinIO)...
docker-compose up -d
if errorlevel 1 (
  echo Docker Compose failed. Please ensure Docker Desktop is running.
  pause
  exit /b 1
)

echo.
echo Waiting for database to be ready...
timeout /t 5 /nobreak >nul

echo Setting up Database (Prisma Generate, Migrate, Seed)...
call npm run prisma:generate
call npm run prisma:migrate
call npm run seed

echo.
echo Starting Backend API Server...
  start "DSR API Server" cmd /k "cd /d ""%~dp0..\.."" && npm run dev:api"

echo Starting Background Worker...
start "DSR Background Worker" cmd /k "cd /d ""%~dp0..\.."" && npm run dev:worker"

echo Starting Modern Next.js Frontend...
start "DSR Next.js Frontend" cmd /k "cd /d ""%~dp0..\.."" && npm run dev:web"

echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo Opening the modern frontend...
start http://localhost:3000

echo.
echo Done. Keep the opened terminal windows running for all services.
echo.
echo Demo login:
echo admin@demo.com / password123
echo iit@demo.com / password123
echo sdlc@demo.com / password123
echo.
pause
exit /b 0
