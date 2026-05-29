<?php

function getDatabaseConnection() {
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $db = getenv('DB_NAME') ?: 'smartcampus';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

    try {
        return new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $exception) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Impossible de se connecter à la base de données']);
        exit;
    }
}
