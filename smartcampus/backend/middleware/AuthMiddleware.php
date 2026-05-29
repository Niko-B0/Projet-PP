<?php

function startSessionOnce() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function requireAuthentication() {
    startSessionOnce();
    if (empty($_SESSION['id_user'])) {
        sendError('Accès refusé, vous devez vous connecter.', 401);
    }
}

function currentSessionUser() {
    startSessionOnce();
    return [
        'id_user' => $_SESSION['id_user'] ?? null,
        'role' => $_SESSION['role'] ?? null,
        'nom' => $_SESSION['nom'] ?? null,
        'prenom' => $_SESSION['prenom'] ?? null,
        'id_student' => $_SESSION['id_student'] ?? null,
        'id_teacher' => $_SESSION['id_teacher'] ?? null,
    ];
}
