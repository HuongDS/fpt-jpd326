@echo off
title DUNG NIHONGO SPEED MASTER - JPD326
chcp 65001 >nul
echo ========================================================
echo        DANG DUNG SERVER LOCALHOST:3000...
echo ========================================================

set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    set FOUND=1
    echo [+] Dang tat tien trinh dang chay cong 3000 - PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

if "%FOUND%"=="1" (
    echo.
    echo [THANH CONG] Da tat server localhost:3000 hoan toan!
) else (
    echo.
    echo [THONG BAO] Khong co server nao dang mo tren cong 3000.
)

echo ========================================================
echo Nhan phim bat ky de thoat...
pause >nul
