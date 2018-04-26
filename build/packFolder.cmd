:: System requirements:
:: * OS: Windows
:: * 7z
::
:: Steps:
:: * Adjust %filename% and %compressor% variables to fit your needs.
:: * Run this script, and the packed files are created in the ..\dist\ directory.
::
::
@echo off
set "filename=WebScrapbook"
set "dir=%~dp0"
set "dir=%dir:~0, -1%"
set "src=%dir%\..\src"
set "dist=%dir%\..\dist"

:Folder
set "fn=%filename%"
::xcopy "%src%" "%dist%\%fn%" /E /Y /R /Q /I
robocopy "%src%" "%dist%\%fn%" /E

pause >nul

goto Folder
