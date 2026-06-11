@echo off
REM Install cdn-pvp-parser as a Windows service via NSSM.
REM
REM Prerequisites:
REM   1. cdn-pvp-parser.exe and config.yaml in the SAME folder as this script.
REM   2. nssm.exe in the same folder (https://nssm.cc/download — pick win64).
REM   3. Run this script "As Administrator".

setlocal

set SERVICE_NAME=CDN-PvP-Parser
set EXE=%~dp0cdn-pvp-parser.exe
set NSSM=%~dp0nssm.exe
set WORKDIR=%~dp0
REM Strip trailing backslash from WORKDIR (NSSM is picky).
if "%WORKDIR:~-1%"=="\" set WORKDIR=%WORKDIR:~0,-1%

if not exist "%EXE%" (
  echo ERROR: %EXE% not found.
  exit /b 1
)
if not exist "%NSSM%" (
  echo ERROR: nssm.exe not found next to this script.
  echo Download win64 build from https://nssm.cc/download and drop it here.
  exit /b 1
)
if not exist "%WORKDIR%\config.yaml" (
  echo ERROR: config.yaml not found next to the .exe. Create it first.
  exit /b 1
)

echo Removing any existing service (ignore errors if absent)...
"%NSSM%" stop %SERVICE_NAME% >nul 2>&1
"%NSSM%" remove %SERVICE_NAME% confirm >nul 2>&1

echo Installing service %SERVICE_NAME%...
"%NSSM%" install %SERVICE_NAME% "%EXE%" run
if errorlevel 1 exit /b 1

"%NSSM%" set %SERVICE_NAME% AppDirectory "%WORKDIR%"
"%NSSM%" set %SERVICE_NAME% Start SERVICE_AUTO_START
"%NSSM%" set %SERVICE_NAME% AppStdout "%WORKDIR%\service-stdout.log"
"%NSSM%" set %SERVICE_NAME% AppStderr "%WORKDIR%\service-stderr.log"
"%NSSM%" set %SERVICE_NAME% AppRotateFiles 1
"%NSSM%" set %SERVICE_NAME% AppRotateBytes 5242880
"%NSSM%" set %SERVICE_NAME% AppExit Default Restart
"%NSSM%" set %SERVICE_NAME% AppRestartDelay 5000
"%NSSM%" set %SERVICE_NAME% Description "Ships DayZ PvP events (.ADM logs) to the CDN website."

echo Starting service...
"%NSSM%" start %SERVICE_NAME%
if errorlevel 1 (
  echo Service installed but failed to start. Check service-stderr.log.
  exit /b 1
)

echo.
echo OK — %SERVICE_NAME% installed and running.
echo Logs: %WORKDIR%\service-stdout.log  and  agent.log (per config.yaml)
echo Stop:    "%NSSM%" stop %SERVICE_NAME%
echo Remove:  "%NSSM%" remove %SERVICE_NAME% confirm

endlocal
