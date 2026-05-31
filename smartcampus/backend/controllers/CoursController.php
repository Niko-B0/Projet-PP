<?php

class CoursController {
    public static function index() {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT c.id_course, c.nom_cours, c.description, c.capacite, c.semestre, c.matiere, c.niveau, c.credits, c.coefficient, u.nom AS teacher_name, (SELECT COUNT(*) FROM enrollments e WHERE e.id_course = c.id_course AND e.statut = "active") AS enrolled_count, GROUP_CONCAT(DISTINCT CONCAT(s.jour, " ", s.heure_debut, "-", s.heure_fin) SEPARATOR ", ") AS schedule FROM courses c JOIN teachers t ON c.id_teacher = t.id_teacher JOIN users u ON t.id_user = u.id_user LEFT JOIN schedule_slots s ON c.id_course = s.id_course GROUP BY c.id_course');
        sendSuccess($stmt->fetchAll());
    }

    public static function show($id) {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT c.id_course, c.nom_cours, c.description, c.capacite, c.semestre, c.matiere, c.niveau, c.credits, c.coefficient, u.nom AS teacher_name FROM courses c JOIN teachers t ON c.id_teacher = t.id_teacher JOIN users u ON t.id_user = u.id_user WHERE c.id_course = :id_course');
        $stmt->execute(['id_course' => $id]);
        $course = $stmt->fetch();
        if (!$course) {
            sendError('Cours introuvable', 404);
        }
        sendSuccess($course);
    }

    public static function create() {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['nom_cours']) || !isset($input['id_teacher']) || !isset($input['capacite'])) {
            sendError('Champs obligatoires manquants', 400);
        }
        if ($input['capacite'] <= 0) {
            sendError('Capacité doit être positive', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('INSERT INTO courses (nom_cours, description, capacite, semestre, matiere, niveau, credits, coefficient, id_teacher) VALUES (:nom_cours, :description, :capacite, :semestre, :matiere, :niveau, :credits, :coefficient, :id_teacher)');
        $stmt->execute([
            'nom_cours' => $input['nom_cours'],
            'description' => $input['description'] ?? '',
            'capacite' => $input['capacite'],
            'semestre' => $input['semestre'] ?? 1,
            'matiere' => $input['matiere'] ?? '',
            'niveau' => $input['niveau'] ?? '',
            'credits' => $input['credits'] ?? 3,
            'coefficient' => $input['coefficient'] ?? 1,
            'id_teacher' => $input['id_teacher']
        ]);
        sendSuccess(['id_course' => $pdo->lastInsertId()]);
    }

    public static function update($id) {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('UPDATE courses SET nom_cours = :nom_cours, description = :description, capacite = :capacite, semestre = :semestre, matiere = :matiere, niveau = :niveau, credits = :credits, coefficient = :coefficient, id_teacher = :id_teacher WHERE id_course = :id_course');
        $stmt->execute([
            'nom_cours' => $input['nom_cours'] ?? '',
            'description' => $input['description'] ?? '',
            'capacite' => $input['capacite'] ?? 0,
            'semestre' => $input['semestre'] ?? 1,
            'matiere' => $input['matiere'] ?? '',
            'niveau' => $input['niveau'] ?? '',
            'credits' => $input['credits'] ?? 3,
            'coefficient' => $input['coefficient'] ?? 1,
            'id_teacher' => $input['id_teacher'] ?? 0,
            'id_course' => $id
        ]);
        sendSuccess(['id_course' => $id]);
    }

    public static function delete($id) {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('DELETE FROM courses WHERE id_course = :id_course');
        $stmt->execute(['id_course' => $id]);
        sendSuccess(['message' => 'Cours supprimé']);
    }

    public static function getStudents($id) {
        requireAuthentication();
        $current = currentSessionUser();
        $pdo = getDatabaseConnection();
        if ($current['role'] === 'teacher') {
            $stmt = $pdo->prepare('SELECT id_course FROM courses WHERE id_course = :id_course AND id_teacher = :id_teacher');
            $stmt->execute(['id_course' => $id, 'id_teacher' => $current['id_teacher']]);
            if (!$stmt->fetch()) {
                sendError('Acces interdit', 403);
            }
        }
        $stmt = $pdo->prepare('SELECT e.id_enrollment AS enrollment_id, s.id_student, u.nom, u.prenom, u.email, u.telephone, g.id_grade, g.valeur, g.coef, g.type_evaluation, g.locked FROM enrollments e JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user LEFT JOIN grades g ON g.id_enrollment = e.id_enrollment WHERE e.id_course = :id_course');
        $stmt->execute(['id_course' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getGrades($id) {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT g.id_grade, u.nom, u.prenom, c.nom_cours, g.valeur, g.coef, g.type_evaluation, g.locked FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user JOIN courses c ON e.id_course = c.id_course WHERE c.id_course = :id_course');
        $stmt->execute(['id_course' => $id]);
        sendSuccess($stmt->fetchAll());
    }
}
