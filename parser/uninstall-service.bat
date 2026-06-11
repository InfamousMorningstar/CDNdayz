@echo off
REM Uninstall the CDN-PvP-Parser Windows service. Run as Administrator.

setlocal
set SERVICE_NAME=CDN-PvP-Parser
set NSSM=%~dp0nssm.exe

if not exist "%NSSM%" (
  echo ERROR: nssm.exe not found next to this script.
  exit /b 1
)

"%NSSM%" stop %SERVICE_NAME%
"%NSSM%" remove %SERVICE_NAME% confirm

echo Done.
endlocal
