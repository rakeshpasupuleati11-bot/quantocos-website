@echo off
cd /d "%~dp0"
echo Starting local preview on http://127.0.0.1:8899
start "" http://127.0.0.1:8899/index.html
python -m http.server 8899 --bind 127.0.0.1
