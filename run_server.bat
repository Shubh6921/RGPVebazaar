@echo off
title RGPV Unofficial - Local Campus Server
cd /d "%~dp0"
echo ========================================================
echo   RGPV UNOFFICIAL - Starting Campus Local Server...
echo ========================================================
echo Starting server at http://localhost:3000 and http://127.0.0.1:3000
start http://localhost:3000/
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
