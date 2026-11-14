@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist node_modules (
  echo [1/2] 패키지 설치 중...
  call npm install
)
echo [2/2] 개발 서버 실행 - 브라우저가 열립니다 (http://localhost:5173)
call npm run dev -- --open
pause
