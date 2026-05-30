@echo off
setlocal

set "MAMP_PHP_DIR=C:\MAMP\bin\php"

if not exist "%MAMP_PHP_DIR%\" (
    echo Erreur : MAMP est introuvable dans C:\MAMP\.
    echo Installez MAMP dans C:\MAMP\ ou lancez database\seed.php avec un PHP qui contient pdo_mysql.
    pause
    exit /b 1
)

set "PHP_EXE="

for /f "delims=" %%D in ('dir /b /ad /o-d "%MAMP_PHP_DIR%\php*" 2^>nul') do (
    if exist "%MAMP_PHP_DIR%\%%D\php.exe" (
        set "PHP_EXE=%MAMP_PHP_DIR%\%%D\php.exe"
        goto :php_found
    )
)

:php_found
if not defined PHP_EXE (
    echo Erreur : aucun executable PHP MAMP trouve dans %MAMP_PHP_DIR%\php*\php.exe.
    pause
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
set "DB_HOST=127.0.0.1"
set "DB_NAME=smartcampus"
set "DB_USER=root"
set "DB_PASS=root"

echo PHP utilise : %PHP_EXE%
echo Base cible : %DB_NAME% sur %DB_HOST%
echo.

"%PHP_EXE%" -r "exit(extension_loaded('pdo_mysql') ? 0 : 1);" >nul 2>nul
if errorlevel 1 (
    "%PHP_EXE%" -d extension=php_pdo_mysql "%SCRIPT_DIR%seed.php"
) else (
    "%PHP_EXE%" "%SCRIPT_DIR%seed.php"
)

if errorlevel 1 (
    echo.
    echo Erreur : l'initialisation des donnees a echoue.
    echo Verifiez que MySQL est demarre dans MAMP et que la base smartcampus existe.
    pause
    exit /b 1
)

echo.
echo Donnees de test initialisees avec succes.
pause
