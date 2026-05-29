<?php

class InscriptionController {
    public static function index() {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT e.id_enrollment, s.id_student, u.nom AS student_name, c.id_course, c.nom_cours, e.date_inscription, e.statut FROM enrollments e JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user JOIN courses c ON e.id_course = c.id_course');
        sendSuccess($stmt->fetchAll());
    }

    public static function create() {
        requireAuthentication();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['id_student']) || empty($input['id_course'])) {
            sendError('id_student et id_course sont requis', 400);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT * FROM enrollments WHERE id_student = :id_student AND id_course = :id_course AND statut = "active"');
        $stmt->execute(['id_student' => $input['id_student'], 'id_course' => $input['id_course']]);
        if ($stmt->fetch()) {
            sendError('Double inscription interdite.', 400);
        }

        $stmt = $pdo->prepare('SELECT capacite FROM courses WHERE id_course = :id_course');
        $stmt->execute(['id_course' => $input['id_course']]);
        $course = $stmt->fetch();
        if (!$course) {
            sendError('Cours introuvable', 404);
        }

        $stmt = $pdo->prepare('SELECT COUNT(*) FROM enrollments WHERE id_course = :id_course AND statut = "active"');
        $stmt->execute(['id_course' => $input['id_course']]);
        if ($stmt->fetchColumn() >= $course['capacite']) {
            sendError('Capacité maximale atteinte.', 400);
        }

        $stmt = $pdo->prepare('SELECT s.jour, s.heure_debut, s.heure_fin FROM schedule_slots s JOIN enrollments e ON s.id_course = e.id_course WHERE e.id_student = :id_student AND e.statut = "active"');
        $stmt->execute(['id_student' => $input['id_student']]);
        $studentSlots = $stmt->fetchAll();

        $stmt = $pdo->prepare('SELECT jour, heure_debut, heure_fin FROM schedule_slots WHERE id_course = :id_course');
        $stmt->execute(['id_course' => $input['id_course']]);
        $courseSlots = $stmt->fetchAll();

        foreach ($courseSlots as $newSlot) {
            foreach ($studentSlots as $slot) {
                if ($slot['jour'] === $newSlot['jour'] && $newSlot['heure_debut'] < $slot['heure_fin'] && $newSlot['heure_fin'] > $slot['heure_debut']) {
                    sendError('Conflit d’emploi du temps détecté.', 400);
                }
            }
        }

        $stmt = $pdo->prepare('INSERT INTO enrollments (id_student, id_course, date_inscription, statut) VALUES (:id_student, :id_course, CURDATE(), "active")');
        $stmt->execute(['id_student' => $input['id_student'], 'id_course' => $input['id_course']]);
        sendSuccess(['id_enrollment' => $pdo->lastInsertId()]);
    }

    public static function delete($id) {
        requireAuthentication();
        $current = currentSessionUser();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_student FROM enrollments WHERE id_enrollment = :id_enrollment');
        $stmt->execute(['id_enrollment' => $id]);
        $enrollment = $stmt->fetch();
        if (!$enrollment) {
            sendError('Inscription introuvable', 404);
        }
        if ($current['role'] === 'student' && $current['id_student'] != $enrollment['id_student']) {
            sendError('Accès interdit', 403);
        }
        $pdo->prepare('DELETE FROM enrollments WHERE id_enrollment = :id_enrollment')->execute(['id_enrollment' => $id]);
        sendSuccess(['message' => 'Inscription supprimée']);
    }
}
