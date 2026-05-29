<?php

class EmploiDuTempsController {
    public static function index() {
        requireAuthentication();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT s.id_slot, c.id_course, c.nom_cours, c.niveau, s.jour, s.heure_debut, s.heure_fin, s.salle FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course');
        sendSuccess($stmt->fetchAll());
    }

    public static function create() {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['id_course']) || empty($input['jour']) || empty($input['heure_debut']) || empty($input['heure_fin']) || empty($input['salle'])) {
            sendError('Tous les champs sont obligatoires', 400);
        }
        if ($input['heure_debut'] >= $input['heure_fin']) {
            sendError('Heure de début doit être avant heure de fin', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM schedule_slots WHERE salle = :salle AND jour = :jour AND heure_debut < :heure_fin AND heure_fin > :heure_debut');
        $stmt->execute([
            'salle' => $input['salle'],
            'jour' => $input['jour'],
            'heure_debut' => $input['heure_debut'],
            'heure_fin' => $input['heure_fin']
        ]);
        if ($stmt->fetchColumn() > 0) {
            sendError('Conflit de salle détecté.', 400);
        }
        $stmt = $pdo->prepare('INSERT INTO schedule_slots (id_course, jour, heure_debut, heure_fin, salle) VALUES (:id_course, :jour, :heure_debut, :heure_fin, :salle)');
        $stmt->execute([
            'id_course' => $input['id_course'],
            'jour' => $input['jour'],
            'heure_debut' => $input['heure_debut'],
            'heure_fin' => $input['heure_fin'],
            'salle' => $input['salle']
        ]);
        sendSuccess(['id_slot' => $pdo->lastInsertId()]);
    }

    public static function update($id) {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['jour']) || empty($input['heure_debut']) || empty($input['heure_fin']) || empty($input['salle'])) {
            sendError('Tous les champs sont obligatoires', 400);
        }
        if ($input['heure_debut'] >= $input['heure_fin']) {
            sendError('Heure de début doit être avant heure de fin', 400);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM schedule_slots WHERE salle = :salle AND jour = :jour AND heure_debut < :heure_fin AND heure_fin > :heure_debut AND id_slot != :id_slot');
        $stmt->execute([
            'salle' => $input['salle'],
            'jour' => $input['jour'],
            'heure_debut' => $input['heure_debut'],
            'heure_fin' => $input['heure_fin'],
            'id_slot' => $id
        ]);
        if ($stmt->fetchColumn() > 0) {
            sendError('Conflit de salle détecté.', 400);
        }
        $stmt = $pdo->prepare('UPDATE schedule_slots SET jour = :jour, heure_debut = :heure_debut, heure_fin = :heure_fin, salle = :salle WHERE id_slot = :id_slot');
        $stmt->execute([
            'jour' => $input['jour'],
            'heure_debut' => $input['heure_debut'],
            'heure_fin' => $input['heure_fin'],
            'salle' => $input['salle'],
            'id_slot' => $id
        ]);
        sendSuccess(['id_slot' => $id]);
    }

    public static function delete($id) {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('DELETE FROM schedule_slots WHERE id_slot = :id_slot');
        $stmt->execute(['id_slot' => $id]);
        sendSuccess(['message' => 'Créneau supprimé']);
    }

    public static function getStudentSchedule($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT s.id_slot, c.nom_cours, c.niveau, t.nom AS teacher_name, s.jour, s.heure_debut, s.heure_fin, s.salle FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course JOIN teachers th ON c.id_teacher = th.id_teacher JOIN users t ON th.id_user = t.id_user JOIN enrollments e ON c.id_course = e.id_course WHERE e.id_student = :id_student AND e.statut = "active"');
        $stmt->execute(['id_student' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getTeacherSchedule($id) {
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
