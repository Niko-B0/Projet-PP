<?php

class EnseignantController {
    public static function index() {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT th.id_teacher, u.id_user, u.nom, u.prenom, u.email, u.telephone, th.matiere, th.bureau, (SELECT COUNT(*) FROM courses c WHERE c.id_teacher = th.id_teacher) AS courseCount FROM teachers th JOIN users u ON th.id_user = u.id_user');
        sendSuccess($stmt->fetchAll());
    }

    public static function show($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $id) {
            sendError('Accès interdit', 403);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT th.id_teacher, u.nom, u.prenom, u.email, u.telephone, th.matiere, th.bureau FROM teachers th JOIN users u ON th.id_user = u.id_user WHERE th.id_teacher = :id_teacher');
        $stmt->execute(['id_teacher' => $id]);
        $teacher = $stmt->fetch();
        if (!$teacher) {
            sendError('Enseignant introuvable', 404);
        }
        sendSuccess($teacher);
    }

    public static function create() {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['email']) || empty($input['password']) || empty($input['nom']) || empty($input['prenom'])) {
            sendError('Champs obligatoires manquants', 400);
        }
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            sendError('Email invalide', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_user FROM users WHERE email = :email');
        $stmt->execute(['email' => $input['email']]);
        if ($stmt->fetch()) {
            sendError('Cet email est deja utilise', 400);
        }

        $stmt = $pdo->prepare('INSERT INTO users (nom, prenom, email, mot_de_passe, role, telephone, date_creation) VALUES (:nom, :prenom, :email, :mot_de_passe, "teacher", :telephone, NOW())');
        $stmt->execute([
            'nom' => $input['nom'],
            'prenom' => $input['prenom'],
            'email' => $input['email'],
            'mot_de_passe' => password_hash($input['password'], PASSWORD_DEFAULT),
            'telephone' => $input['telephone'] ?? ''
        ]);
        $idUser = $pdo->lastInsertId();
        $stmt = $pdo->prepare('INSERT INTO teachers (id_user, matiere, bureau) VALUES (:id_user, :matiere, :bureau)');
        $stmt->execute([
            'id_user' => $idUser,
            'matiere' => $input['matiere'] ?? '',
            'bureau' => $input['bureau'] ?? ''
        ]);
        sendSuccess(['id_teacher' => $pdo->lastInsertId()]);
    }

    public static function update($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $id) {
            sendError('Acces interdit', 403);
        }
        if ($current['role'] !== 'teacher' && $current['role'] !== 'admin') {
            sendError('Acces interdit', 403);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['email']) || empty($input['nom']) || empty($input['prenom'])) {
            sendError('Champs obligatoires manquants', 400);
        }
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            sendError('Email invalide', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_user FROM teachers WHERE id_teacher = :id_teacher');
        $stmt->execute(['id_teacher' => $id]);
        $teacher = $stmt->fetch();
        if (!$teacher) {
            sendError('Enseignant introuvable', 404);
        }
        $stmt = $pdo->prepare('SELECT id_user FROM users WHERE email = :email AND id_user <> :id_user');
        $stmt->execute(['email' => $input['email'], 'id_user' => $teacher['id_user']]);
        if ($stmt->fetch()) {
            sendError('Cet email est deja utilise', 400);
        }

        $stmt = $pdo->prepare('UPDATE users SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone WHERE id_user = :id_user');
        $stmt->execute([
            'nom' => $input['nom'] ?? '',
            'prenom' => $input['prenom'] ?? '',
            'email' => $input['email'] ?? '',
            'telephone' => $input['telephone'] ?? '',
            'id_user' => $teacher['id_user']
        ]);
        $stmt = $pdo->prepare('UPDATE teachers SET matiere = :matiere, bureau = :bureau WHERE id_teacher = :id_teacher');
        $stmt->execute([
            'matiere' => $input['matiere'] ?? '',
            'bureau' => $input['bureau'] ?? '',
            'id_teacher' => $id
        ]);
        sendSuccess(['id_teacher' => $id]);
    }

    public static function delete($id) {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_user FROM teachers WHERE id_teacher = :id_teacher');
        $stmt->execute(['id_teacher' => $id]);
        $teacher = $stmt->fetch();
        if (!$teacher) {
            sendError('Enseignant introuvable', 404);
        }
        $pdo->prepare('DELETE FROM teachers WHERE id_teacher = :id_teacher')->execute(['id_teacher' => $id]);
        $pdo->prepare('DELETE FROM users WHERE id_user = :id_user')->execute(['id_user' => $teacher['id_user']]);
        sendSuccess(['message' => 'Enseignant supprimé']);
    }

    public static function getCourses($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $id) {
            sendError('Accès interdit', 403);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.id_course = c.id_course AND e.statut = "active") AS enrolled_count FROM courses c WHERE c.id_teacher = :id_teacher');
        $stmt->execute(['id_teacher' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getSchedule($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $id) {
            sendError('Accès interdit', 403);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT s.id_slot, c.nom_cours, c.niveau, s.jour, s.heure_debut, s.heure_fin, s.salle FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course WHERE c.id_teacher = :id_teacher');
        $stmt->execute(['id_teacher' => $id]);
        sendSuccess($stmt->fetchAll());
    }
}
