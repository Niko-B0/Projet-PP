@echo off
setlocal

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

:php_found
if not defined PHP_EXE (
    echo Erreur : aucun executable PHP n'a ete trouve.
    echo Installez PHP ou utilisez MAMP, XAMPP, WAMP ou Laragon.
    echo Vous pouvez aussi ajouter php.exe au PATH Windows.
    pause
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
if not defined DB_HOST set "DB_HOST=127.0.0.1"
if not defined DB_NAME set "DB_NAME=smartcampus"
if not defined DB_USER set "DB_USER=root"
if not defined DB_PASS (
    if "%PHP_SOURCE%"=="MAMP" (
        set "DB_PASS=root"
    ) else (
        set "DB_PASS="
    )
)

echo PHP utilise : %PHP_EXE% [%PHP_SOURCE%]
echo Base cible : %DB_NAME% sur %DB_HOST%
echo Utilisateur MySQL : %DB_USER%
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
    echo Verifiez que MySQL est demarre, que la base smartcampus existe,
    echo et que DB_USER / DB_PASS correspondent a votre serveur local.
    pause
    exit /b 1
)

echo.
echo Donnees de test initialisees avec succes.
pause
