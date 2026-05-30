<?php

class EtudiantController {
    public static function index() {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->query('SELECT s.id_student, u.id_user, u.nom, u.prenom, u.email, u.telephone, s.date_naissance, s.niveau, s.annee_entree, s.specialite, s.numero_etudiant FROM students s JOIN users u ON s.id_user = u.id_user');
        sendSuccess($stmt->fetchAll());
    }

    public static function show($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT s.id_student, u.nom, u.prenom, u.email, u.telephone, s.date_naissance, s.niveau, s.annee_entree, s.specialite, s.numero_etudiant FROM students s JOIN users u ON s.id_user = u.id_user WHERE s.id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        $student = $stmt->fetch();
        if (!$student) {
            sendError('Étudiant introuvable', 404);
        }

        $student['courses'] = [];
        $stmt = $pdo->prepare('SELECT c.id_course, c.nom_cours, c.semestre FROM enrollments e JOIN courses c ON e.id_course = c.id_course WHERE e.id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        $student['courses'] = $stmt->fetchAll();

        $stmt = $pdo->prepare('SELECT AVG(g.valeur) AS average FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment WHERE e.id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        $student['average'] = round($stmt->fetchColumn(), 2);

        $stmt = $pdo->prepare('SELECT COUNT(a.id_attendance) AS absenceCount FROM attendance a JOIN enrollments e ON a.id_enrollment = e.id_enrollment WHERE e.id_student = :id_student AND a.statut = "absent"');
        $stmt->execute(['id_student' => $id]);
        $student['absenceCount'] = (int) $stmt->fetchColumn();

        sendSuccess($student);
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

        $stmt = $pdo->prepare('INSERT INTO users (nom, prenom, email, mot_de_passe, role, telephone, date_creation) VALUES (:nom, :prenom, :email, :mot_de_passe, "student", :telephone, NOW())');
        $stmt->execute([
            'nom' => $input['nom'],
            'prenom' => $input['prenom'],
            'email' => $input['email'],
            'mot_de_passe' => password_hash($input['password'], PASSWORD_DEFAULT),
            'telephone' => $input['telephone'] ?? ''
        ]);

        $idUser = $pdo->lastInsertId();
        $stmt = $pdo->prepare('INSERT INTO students (id_user, date_naissance, niveau, annee_entree, specialite, numero_etudiant) VALUES (:id_user, :date_naissance, :niveau, :annee_entree, :specialite, :numero_etudiant)');
        $stmt->execute([
            'id_user' => $idUser,
            'date_naissance' => $input['date_naissance'] ?? null,
            'niveau' => $input['niveau'] ?? '',
            'annee_entree' => $input['annee_entree'] ?? null,
            'specialite' => $input['specialite'] ?? '',
            'numero_etudiant' => $input['numero_etudiant'] ?? ''
        ]);

        sendSuccess(['id_student' => $pdo->lastInsertId()]);
    }

    public static function update($id) {
        requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true);
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_user FROM students WHERE id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        $student = $stmt->fetch();
        if (!$student) {
            sendError('Étudiant introuvable', 404);
        }

        $stmt = $pdo->prepare('UPDATE users SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone WHERE id_user = :id_user');
        $stmt->execute([
            'nom' => $input['nom'] ?? '',
            'prenom' => $input['prenom'] ?? '',
            'email' => $input['email'] ?? '',
            'telephone' => $input['telephone'] ?? '',
            'id_user' => $student['id_user']
        ]);

        $stmt = $pdo->prepare('UPDATE students SET date_naissance = :date_naissance, niveau = :niveau, annee_entree = :annee_entree, specialite = :specialite, numero_etudiant = :numero_etudiant WHERE id_student = :id_student');
        $stmt->execute([
            'date_naissance' => $input['date_naissance'] ?? null,
            'niveau' => $input['niveau'] ?? '',
            'annee_entree' => $input['annee_entree'] ?? null,
            'specialite' => $input['specialite'] ?? '',
            'numero_etudiant' => $input['numero_etudiant'] ?? '',
            'id_student' => $id
        ]);

        sendSuccess(['id_student' => $id]);
    }

    public static function delete($id) {
        requireAdmin();
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT id_user FROM students WHERE id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        $student = $stmt->fetch();
        if (!$student) {
            sendError('Étudiant introuvable', 404);
        }
        $pdo->prepare('DELETE FROM students WHERE id_student = :id_student')->execute(['id_student' => $id]);
        $pdo->prepare('DELETE FROM users WHERE id_user = :id_user')->execute(['id_user' => $student['id_user']]);
        sendSuccess(['message' => 'Étudiant supprimé']);
    }

    public static function getCourses($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT e.id_enrollment AS enrollment_id, c.id_course, c.nom_cours, t.nom AS teacher_name, c.semestre, c.credits, c.coefficient FROM enrollments e JOIN courses c ON e.id_course = c.id_course JOIN teachers th ON c.id_teacher = th.id_teacher JOIN users t ON th.id_user = t.id_user WHERE e.id_student = :id_student AND e.statut = "active"');
        $stmt->execute(['id_student' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getGrades($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT g.id_grade, c.nom_cours, g.valeur, g.coef, g.type_evaluation, (SELECT AVG(valeur) FROM grades WHERE id_enrollment = g.id_enrollment) AS course_average FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment JOIN courses c ON e.id_course = c.id_course WHERE e.id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getAttendance($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT a.id_attendance, c.nom_cours, a.date_presence, s.heure_debut, s.heure_fin, a.statut FROM attendance a JOIN enrollments e ON a.id_enrollment = e.id_enrollment JOIN schedule_slots s ON a.id_slot = s.id_slot JOIN courses c ON s.id_course = c.id_course WHERE e.id_student = :id_student ORDER BY a.date_presence DESC');
        $stmt->execute(['id_student' => $id]);
        sendSuccess($stmt->fetchAll());
    }

    public static function getSchedule($id) {
        requireAuthentication();
        $current = currentSessionUser();
        if ($current['role'] === 'student' && $current['id_student'] != $id) {
            sendError('Accès interdit', 403);
        }

        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare('SELECT s.id_slot, c.nom_cours, c.niveau, t.nom AS teacher_name, s.jour, s.heure_debut, s.heure_fin, s.salle FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course JOIN teachers th ON c.id_teacher = th.id_teacher JOIN users t ON th.id_user = t.id_user JOIN enrollments e ON c.id_course = e.id_course WHERE e.id_student = :id_student');
        $stmt->execute(['id_student' => $id]);
        sendSuccess($stmt->fetchAll());
    }
}
