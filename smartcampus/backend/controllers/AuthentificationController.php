<?php

class AuthentificationController {
    public static function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['email']) || empty($input['password'])) {
            sendError('Email et mot de passe sont requis.', 400);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute(['email' => $input['email']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($input['password'], $user['mot_de_passe'])) {
            sendError('Identifiants incorrects.', 401);
        }

        session_start();
        $_SESSION['id_user'] = $user['id_user'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['nom'] = $user['nom'];
        $_SESSION['prenom'] = $user['prenom'];

        if ($user['role'] === 'student') {
            $stmt = $pdo->prepare('SELECT id_student FROM students WHERE id_user = :id_user');
            $stmt->execute(['id_user' => $user['id_user']]);
            $info = $stmt->fetch();
            $_SESSION['id_student'] = $info['id_student'] ?? null;
        }

        if ($user['role'] === 'teacher') {
            $stmt = $pdo->prepare('SELECT id_teacher FROM teachers WHERE id_user = :id_user');
            $stmt->execute(['id_user' => $user['id_user']]);
            $info = $stmt->fetch();
            $_SESSION['id_teacher'] = $info['id_teacher'] ?? null;
        }

        sendSuccess([
            'id_user' => $user['id_user'],
            'role' => $user['role'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'id_student' => $_SESSION['id_student'] ?? null,
            'id_teacher' => $_SESSION['id_teacher'] ?? null,
        ]);
    }

    public static function logout() {
        session_start();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        sendSuccess(['message' => 'Déconnecté']);
    }

    public static function me() {
        session_start();
        if (empty($_SESSION['id_user'])) {
            sendError('Utilisateur non connecté', 401);
        }

        $data = [
            'id_user' => $_SESSION['id_user'],
            'role' => $_SESSION['role'],
            'nom' => $_SESSION['nom'],
            'prenom' => $_SESSION['prenom'],
            'id_student' => $_SESSION['id_student'] ?? null,
            'id_teacher' => $_SESSION['id_teacher'] ?? null,
        ];
        sendSuccess($data);
    }
}
