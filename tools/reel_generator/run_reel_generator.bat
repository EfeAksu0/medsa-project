@echo off
echo ==========================================
echo       MEDYSA AI REEL GENERATOR 🎬
echo ==========================================
echo.
echo Checking for files...

cd /d "%~dp0"

if not exist "input" mkdir input
if not exist "output" mkdir output
if not exist "music" mkdir music

echo.
echo Starting generator...
echo.

python generate_reel.py

echo.
echo ==========================================
echo             FINISHED! ✅
echo ==========================================
echo.
echo Check the 'output' folder for your video.
echo.
pause
