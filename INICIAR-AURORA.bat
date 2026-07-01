@echo off
title Aurora Hotel - Lanzador
cd /d "%~dp0"

echo ===============================================
echo     AURORA HOTEL - Iniciando proyecto...
echo ===============================================
echo.

REM --- Primera vez: instala dependencias del backend si faltan ---
if not exist "backend\node_modules" (
  echo [1/3] Instalando dependencias del BACKEND ^(solo la primera vez^)...
  cd backend
  call npm install
  call npx prisma migrate dev --name init
  cd ..
)

REM --- Primera vez: instala dependencias del frontend si faltan ---
if not exist "frontend\node_modules" (
  echo [2/3] Instalando dependencias del FRONTEND ^(solo la primera vez^)...
  cd frontend
  call npm install
  cd ..
)

echo [3/3] Arrancando servidores...

REM --- Las ventanas heredan esta carpeta, por eso usamos rutas relativas ---
start "Aurora API (backend)" cmd /k "cd backend && npm run dev"
start "Aurora Web (frontend)" cmd /k "cd frontend && npm start"

REM --- Espera a que Angular compile y abre el navegador ---
echo Esperando a que la web levante (30 segundos)...
timeout /t 30 /nobreak >nul
start "" http://localhost:4200

echo.
echo  LISTO. Se abrieron dos ventanas: backend y frontend.
echo  La web esta en: http://localhost:4200
echo  Para DETENER todo, cierra esas dos ventanas.
echo.
pause
