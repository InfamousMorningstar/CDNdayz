@echo off
REM Build cdn-pvp-parser.exe with PyInstaller.
REM Run from the `parser` folder. Output: dist\cdn-pvp-parser.exe
REM
REM Requirements: Python 3.10+ on PATH.

setlocal

where python >nul 2>&1
if errorlevel 1 (
  echo ERROR: python is not on PATH. Install Python 3.10+ from python.org and re-run.
  exit /b 1
)

if not exist .venv (
  echo Creating virtualenv...
  python -m venv .venv
  if errorlevel 1 exit /b 1
)

call .venv\Scripts\activate.bat

echo Installing build dependencies...
python -m pip install --upgrade pip >nul
pip install -r requirements.txt
pip install pyinstaller
if errorlevel 1 exit /b 1

echo Building cdn-pvp-parser.exe...
pyinstaller ^
  --onefile ^
  --name cdn-pvp-parser ^
  --console ^
  --clean ^
  parser.py
if errorlevel 1 exit /b 1

echo.
echo BUILD OK
echo Executable: %CD%\dist\cdn-pvp-parser.exe
echo.
echo Next: copy cdn-pvp-parser.exe and config.example.yaml to the target machine,
echo       rename config.example.yaml to config.yaml, fill it in, then:
echo         cdn-pvp-parser.exe test-config
echo         cdn-pvp-parser.exe ping
echo         cdn-pvp-parser.exe run

endlocal
