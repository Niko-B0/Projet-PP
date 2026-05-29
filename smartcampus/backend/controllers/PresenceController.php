<?php

class PresenceController {
    public static function index() {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT a.id_attendance, c.nom_cours, u.nom AS student_nom, u.prenom AS student_prenom, a.date_presence, a.statut FROM attendance a JOIN enrollments e ON a.id_enrollment = e.id_enrollment JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user JOIN schedule_slots ss ON a.id_slot = ss.id_slot JOIN courses c ON ss.id_course = c.id_course');
        sendSuccess($stmt->fetchAll());
    }

    public static function create() {
        requireAuthentication();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['id_enrollment']) || empty($input['statut'])) {
            sendError('id_enrollment et statut sont requis.', 400);
        }
        $allowed = ['present', 'absent', 'justifie'];
        if (!in_array($input['statut'], $allowed, true)) {
            sendError('Statut invalide.', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT e.id_enrollment, c.id_teacher, e.id_course FROM enrollments e JOIN courses c ON e.id_course = c.id_course WHERE e.id_enrollment = :id_enrollment');
        $stmt->execute(['id_enrollment' => $input['id_enrollment']]);
        $row = $stmt->fetch();
        if (!$row) {
            sendError('Inscription introuvable', 404);
        }
        $current = currentSessionUser();
        if ($current['role'] === 'teacher' && $current['id_teacher'] != $row['id_teacher']) {
            sendError('Vous ne pouvez gérer les présences que pour vos propres cours.', 403);
        }
        $stmt = $pdo->prepare('SELECT id_slot FROM schedule_slots WHERE id_course = :id_course LIMIT 1');
        $stmt->execute(['id_course' => $row['id_course']]);
        $slot = $stmt->fetch();
        if (!$slot) {
            sendError('Aucun créneau disponible pour ce cours.', 400);
        }
        $stmt = $pdo->prepare('SELECT id_attendance FROM attendance WHERE id_enrollment = :id_enrollment AND id_slot = :id_slot');
        $stmt->execute(['id_enrollment' => $input['id_enrollment'], 'id_slot' => $slot['id_slot']]);
        $existing = $stmt->fetch();
        if ($existing) {
            $pdo->prepare('UPDATE attendance SET statut = :statut, date_presence = CURDATE() WHERE id_attendance = :id_attendance')->execute(['statut' => $input['statut'], 'id_attendance' => $existing['id_attendance']]);
            sendSuccess(['id_attendance' => $existing['id_attendance']]);
        }
        $stmt = $pdo->prepare('INSERT INTO attendance (id_enrollment, id_slot, date_presence, statut) VALUES (:id_enrollment, :id_slot, CURDATE(), :statut)');
        $stmt->execute(['id_enrollment' => $input['id_enrollment'], 'id_slot' => $slot['id_slot'], 'statut' => $input['statut']]);
        sendSuccess(['id_attendance' => $pdo->lastInsertId()]);
    }
}
