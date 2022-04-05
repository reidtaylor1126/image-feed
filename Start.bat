echo Starting Emulator
start /min "" cmd.exe /C emulator -avd Pixel_3_API_29 -dns-server 8.8.8.8 -no-snapshot-load
timeout /t 2
echo Starting Expo CLI
expo start