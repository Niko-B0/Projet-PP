<?php

class NoteController {
    public static function index() {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT g.id_grade, c.nom_cours, u.nom AS student_nom, u.prenom AS student_prenom, g.valeur, g.coef, g.type_evaluation, g.locked FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user JOIN courses c ON e.id_course = c.id_course');
        sendSuccess($stmt->fetchAll());
    }

    public static function create() {
        requireAuthentication();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['id_enrollment']) || !isset($input['valeur'])) {
            sendError('id_enrollment et valeur sont requis', 400);
        }
        if ($input['valeur'] < 0 || $input['valeur'] > 20) {
            sendError('La note doit être entre 0 et 20.', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT c.id_teacher, c.id_course FROM courses c JOIN enrollments e ON e.id_course = c.id_course WHERE e.id_enrollment = :id_enrollment');
        $stmt->execute(['id_enrollment' => $input['id_enrollment']]);
        $row = $stmt->fetch();
        if (!$row) {
            sendError('Inscription introuvable', 404);
        }
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $row['id_teacher']) {
            sendError('Vous ne pouvez noter que vos propres cours.', 403);
        }
        $stmt = $pdo->prepare('INSERT INTO grades (id_enrollment, id_teacher, valeur, type_evaluation, coef, date_note) VALUES (:id_enrollment, :id_teacher, :valeur, :type_evaluation, :coef, CURDATE())');
        $stmt->execute([
            'id_enrollment' => $input['id_enrollment'],
            'id_teacher' => $current['id_teacher'] ?? $row['id_teacher'],
            'valeur' => $input['valeur'],
            'type_evaluation' => $input['type_evaluation'] ?? 'Contrôle',
            'coef' => $input['coef'] ?? 1
        ]);
        sendSuccess(['id_grade' => $pdo->lastInsertId()]);
    }

    public static function update($id) {
        requireAuthentication();
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['valeur'])) {
            sendError('Valeur est requise', 400);
        }
        if ($input['valeur'] < 0 || $input['valeur'] > 20) {
            sendError('La note doit être entre 0 et 20.', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT g.locked, c.id_teacher FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment JOIN courses c ON e.id_course = c.id_course WHERE g.id_grade = :id_grade');
        $stmt->execute(['id_grade' => $id]);
        $grade = $stmt->fetch();
        if (!$grade) {
            sendError('Note introuvable', 404);
        }
        if ($grade['locked']) {
            sendError('Note verrouillée, modification impossible.', 400);
        }
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $grade['id_teacher']) {
            sendError('Vous ne pouvez modifier que vos propres notes.', 403);
        }
        $stmt = $pdo->prepare('UPDATE grades SET valeur = :valeur, type_evaluation = :type_evaluation, coef = :coef WHERE id_grade = :id_grade');
        $stmt->execute([
            'valeur' => $input['valeur'],
            'type_evaluation' => $input['type_evaluation'] ?? 'Contrôle',
            'coef' => $input['coef'] ?? 1,
            'id_grade' => $id
        ]);
        sendSuccess(['id_grade' => $id]);
    }
}
