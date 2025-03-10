@echo off
echo Creating ZIP archive of the project...
powershell -command "Compress-Archive -Path * -DestinationPath ../project-nano-website.zip -Force"
echo ZIP file created at: %CD%\..\project-nano-website.zip
pause 