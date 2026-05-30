<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';

if (str_starts_with($uri, '/api')) {
    require __DIR__ . '/backend/public/index.php';
    return;
}

$distDir = __DIR__ . '/frontend/dist';
$file = realpath($distDir . $uri);
$distRoot = realpath($distDir);

if ($uri !== '/' && $file && $distRoot && str_starts_with($file, $distRoot) && is_file($file)) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
    ];

    header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));
    readfile($file);
    return;
}

$indexFile = $distDir . '/index.html';
if (!is_file($indexFile)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Frontend non compile. Lancez d'abord : cd frontend && npm install && npm run build";
    return;
}

header('Content-Type: text/html; charset=utf-8');
readfile($indexFile);
