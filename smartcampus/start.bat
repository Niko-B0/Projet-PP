@echo off
setlocal

if not defined DB_HOST set "DB_HOST=127.0.0.1"
if not defined DB_NAME set "DB_NAME=smartcampus"
if not defined DB_USER set "DB_USER=root"
if not defined PORT set "PORT=8000"

set "PHP_EXE="
set "PHP_SOURCE="

where php.exe >nul 2>nul
if not errorlevel 1 (
    for /f "delims=" %%P in ('where php.exe 2^>nul') do (
        set "PHP_EXE=%%P"
        set "PHP_SOURCE=PATH"
        goto :php_found
    )
)

if exist "C:\MAMP\bin\php\" (
    for /f "delims=" %%D in ('dir /b /ad /o-d "C:\MAMP\bin\php\php*" 2^>nul') do (
        if exist "C:\MAMP\bin\php\%%D\php.exe" (
            set "PHP_EXE=C:\MAMP\bin\php\%%D\php.exe"
            set "PHP_SOURCE=MAMP"
            goto :php_found
        )
    )
)

if exist "C:\xampp\php\php.exe" (
    set "PHP_EXE=C:\xampp\php\php.exe"
    set "PHP_SOURCE=XAMPP"
    goto :php_found
)

if exist "C:\wamp64\bin\php\" (
    for /f "delims=" %%P in ('dir /b /s /a-d "C:\wamp64\bin\php\php.exe" "C:\wamp64\bin\php\php*\php.exe" 2^>nul') do (
        set "PHP_EXE=%%P"
        set "PHP_SOURCE=WAMP"
        goto :php_found
    )
)

if exist "C:\laragon\bin\php\" (
    for /f "delims=" %%P in ('dir /b /s /a-d "C:\laragon\bin\php\php.exe" "C:\laragon\bin\php\php*\php.exe" 2^>nul') do (
        set "PHP_EXE=%%P"
        set "PHP_SOURCE=LARAGON"
        goto :php_found
    )
)

echo Erreur : PHP introuvable. Installez PHP ou utilisez MAMP, XAMPP, WAMP ou Laragon.
echo Vous pouvez aussi ajouter php.exe au PATH Windows.
pause
exit /b 1

:php_found
if not defined DB_PASS (
    if "%PHP_SOURCE%"=="MAMP" (
        set "DB_PASS=root"
    ) else (
        set "DB_PASS="
    )
)

if not exist "%~dp0frontend\dist\index.html" (
    echo Erreur : le frontend n'est pas compile.
    echo Lancez d'abord :
    echo   cd frontend
    echo   npm install
    echo   npm run build
    pause
    exit /b 1
)

for %%F in ("%PHP_EXE%") do set "PHP_DIR=%%~dpF"
set "EXT_DIR=%PHP_DIR%ext"

echo.
echo SmartCampus - Demarrage
echo ========================
echo PHP     : %PHP_EXE% [%PHP_SOURCE%]
echo Serveur : http://localhost:%PORT%
echo Base    : %DB_NAME% sur %DB_HOST%
echo User DB : %DB_USER%
echo.

start "" "http://localhost:%PORT%"
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.

"%PHP_EXE%" -r "exit(extension_loaded('pdo_mysql') ? 0 : 1);" >nul 2>nul
if errorlevel 1 (
    if exist "%EXT_DIR%\php_pdo_mysql.dll" (
        "%PHP_EXE%" -d extension_dir="%EXT_DIR%" -d extension=php_pdo_mysql -S localhost:%PORT% "%~dp0router.php"
    ) else (
        "%PHP_EXE%" -d extension=php_pdo_mysql -S localhost:%PORT% "%~dp0router.php"
    )
) else (
    "%PHP_EXE%" -S localhost:%PORT% "%~dp0router.php"
)

pause
