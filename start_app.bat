@echo off
title NIHONGO SPEED MASTER - JPD326
echo ========================================================
echo        NIHONGO SPEED MASTER - JPD326 FA26
echo     Dang khoi chay ung dung hoc cap toc...
echo ========================================================
cd /d "%~dp0web_app"
start "" http://localhost:3000
python -m http.server 3000
pause
