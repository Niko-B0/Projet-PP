<?php

function requireRole($role) {
    requireAuthentication();
    $current = currentSessionUser();
    if ($current['role'] !== $role && $current['role'] !== 'admin') {
        sendError('Accès interdit pour votre rôle.', 403);
    }
}

function requireAdmin() {
    requireAuthentication();
    $current = currentSessionUser();
    if ($current['role'] !== 'admin') {
        sendError('Accès administrateur requis.', 403);
    }
}
