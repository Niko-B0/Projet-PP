<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$path = rtrim($uri, '/');

if ($path === '/api/login' && $method === 'POST') {
    AuthentificationController::login();
}

if ($path === '/api/logout' && $method === 'POST') {
    AuthentificationController::logout();
}

if ($path === '/api/me' && $method === 'GET') {
    AuthentificationController::me();
}

if ($path === '/api/dashboard/student' && $method === 'GET') {
    requireAuthentication();
    $current = currentSessionUser();
    if ($current['role'] !== 'student' && $current['role'] !== 'admin') {
        sendError('Accès interdit', 403);
    }
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT COUNT(*) AS courseCount, SUM(c.credits) AS credits FROM enrollments e JOIN courses c ON e.id_course = c.id_course WHERE e.id_student = :id_student AND e.statut = "active"');
    $stmt->execute(['id_student' => $current['id_student']]);
    $summary = $stmt->fetch();
    $stmt = $pdo->prepare('SELECT AVG(g.valeur) AS average FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment WHERE e.id_student = :id_student');
    $stmt->execute(['id_student' => $current['id_student']]);
    $average = round($stmt->fetchColumn(), 2);
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM attendance a JOIN enrollments e ON a.id_enrollment = e.id_enrollment WHERE e.id_student = :id_student AND a.statut = "absent"');
    $stmt->execute(['id_student' => $current['id_student']]);
    $absenceCount = (int) $stmt->fetchColumn();
    $stmt = $pdo->prepare('SELECT c.nom_cours, s.jour, s.heure_debut, s.heure_fin FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course JOIN enrollments e ON e.id_course = c.id_course WHERE e.id_student = :id_student ORDER BY s.jour LIMIT 3');
    $stmt->execute(['id_student' => $current['id_student']]);
    $sessions = $stmt->fetchAll();
    sendSuccess([
        'courseCount' => (int) $summary['courseCount'],
        'credits' => (int) $summary['credits'],
        'average' => $average ?: 0,
        'absenceCount' => $absenceCount,
        'nextSessions' => count($sessions) > 0 ? $sessions[0]['nom_cours'] . ' - ' . $sessions[0]['jour'] : 'Aucune session à venir'
    ]);
}

if ($path === '/api/dashboard/teacher' && $method === 'GET') {
    requireAuthentication();
    $current = currentSessionUser();
    if ($current['role'] !== 'teacher' && $current['role'] !== 'admin') {
        sendError('Accès interdit', 403);
    }
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM courses WHERE id_teacher = :id_teacher');
    $stmt->execute(['id_teacher' => $current['id_teacher']]);
    $courseCount = (int) $stmt->fetchColumn();
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM grades g JOIN enrollments e ON g.id_enrollment = e.id_enrollment JOIN courses c ON e.id_course = c.id_course WHERE c.id_teacher = :id_teacher');
    $stmt->execute(['id_teacher' => $current['id_teacher']]);
    $gradesToEnter = (int) $stmt->fetchColumn();
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM schedule_slots s JOIN courses c ON s.id_course = c.id_course WHERE c.id_teacher = :id_teacher');
    $stmt->execute(['id_teacher' => $current['id_teacher']]);
    $nextSlots = (int) $stmt->fetchColumn();
    sendSuccess([
        'courseCount' => $courseCount,
        'gradesToEnter' => $gradesToEnter,
        'nextSlots' => $nextSlots
    ]);
}

if ($path === '/api/dashboard/admin' && $method === 'GET') {
    requireAdmin();
    $pdo = getDatabaseConnection();
    $students = $pdo->query('SELECT COUNT(*) FROM students')->fetchColumn();
    $teachers = $pdo->query('SELECT COUNT(*) FROM teachers')->fetchColumn();
    $courses = $pdo->query('SELECT COUNT(*) FROM courses')->fetchColumn();
    sendSuccess([
        'studentsCount' => (int) $students,
        'teachersCount' => (int) $teachers,
        'activeCourses' => (int) $courses,
        'currentSemester' => 2
    ]);
}

if ($path === '/api/students' && $method === 'GET') {
    EtudiantController::index();
}

if ($path === '/api/students' && $method === 'POST') {
    EtudiantController::create();
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)$#', $path, $matches)) {
    EtudiantController::show($matches[1]);
}

if ($method === 'PUT' && preg_match('#^/api/students/([0-9]+)$#', $path, $matches)) {
    EtudiantController::update($matches[1]);
}

if ($method === 'DELETE' && preg_match('#^/api/students/([0-9]+)$#', $path, $matches)) {
    EtudiantController::delete($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/courses$#', $path, $matches)) {
    EtudiantController::getCourses($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/grades$#', $path, $matches)) {
    EtudiantController::getGrades($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/attendance$#', $path, $matches)) {
    EtudiantController::getAttendance($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/schedule$#', $path, $matches)) {
    EtudiantController::getSchedule($matches[1]);
}

if ($path === '/api/teachers' && $method === 'GET') {
    EnseignantController::index();
}

if ($path === '/api/teachers' && $method === 'POST') {
    EnseignantController::create();
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)$#', $path, $matches)) {
    EnseignantController::show($matches[1]);
}

if ($method === 'PUT' && preg_match('#^/api/teachers/([0-9]+)$#', $path, $matches)) {
    EnseignantController::update($matches[1]);
}

if ($method === 'DELETE' && preg_match('#^/api/teachers/([0-9]+)$#', $path, $matches)) {
    EnseignantController::delete($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)/courses$#', $path, $matches)) {
    EnseignantController::getCourses($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)/schedule$#', $path, $matches)) {
    EnseignantController::getSchedule($matches[1]);
}

if ($path === '/api/courses' && $method === 'GET') {
    CoursController::index();
}

if ($path === '/api/courses' && $method === 'POST') {
    CoursController::create();
}

if ($method === 'GET' && preg_match('#^/api/courses/([0-9]+)$#', $path, $matches)) {
    CoursController::show($matches[1]);
}

if ($method === 'PUT' && preg_match('#^/api/courses/([0-9]+)$#', $path, $matches)) {
    CoursController::update($matches[1]);
}

if ($method === 'DELETE' && preg_match('#^/api/courses/([0-9]+)$#', $path, $matches)) {
    CoursController::delete($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/courses/([0-9]+)/students$#', $path, $matches)) {
    CoursController::getStudents($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/courses/([0-9]+)/grades$#', $path, $matches)) {
    CoursController::getGrades($matches[1]);
}

if ($path === '/api/enrollments' && $method === 'GET') {
    InscriptionController::index();
}

if ($path === '/api/enrollments' && $method === 'POST') {
    InscriptionController::create();
}

if ($method === 'DELETE' && preg_match('#^/api/enrollments/([0-9]+)$#', $path, $matches)) {
    InscriptionController::delete($matches[1]);
}

if ($path === '/api/grades' && $method === 'GET') {
    NoteController::index();
}

if ($path === '/api/grades' && $method === 'POST') {
    NoteController::create();
}

if ($method === 'PUT' && preg_match('#^/api/grades/([0-9]+)$#', $path, $matches)) {
    NoteController::update($matches[1]);
}

if ($path === '/api/attendance' && $method === 'GET') {
    PresenceController::index();
}

if ($path === '/api/attendance' && $method === 'POST') {
    PresenceController::create();
}

if ($path === '/api/schedule' && $method === 'GET') {
    EmploiDuTempsController::index();
}

if ($path === '/api/schedule' && $method === 'POST') {
    EmploiDuTempsController::create();
}

if ($method === 'PUT' && preg_match('#^/api/schedule/([0-9]+)$#', $path, $matches)) {
    EmploiDuTempsController::update($matches[1]);
}

if ($method === 'DELETE' && preg_match('#^/api/schedule/([0-9]+)$#', $path, $matches)) {
    EmploiDuTempsController::delete($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/courses/([0-9]+)/attendance$#', $path, $matches)) {
    requireAuthentication();
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT a.id_attendance, u.nom, u.prenom, c.nom_cours, a.date_presence, a.statut FROM attendance a JOIN enrollments e ON a.id_enrollment = e.id_enrollment JOIN students s ON e.id_student = s.id_student JOIN users u ON s.id_user = u.id_user JOIN schedule_slots ss ON a.id_slot = ss.id_slot JOIN courses c ON ss.id_course = c.id_course WHERE c.id_course = :id_course');
    $stmt->execute(['id_course' => $matches[1]]);
    sendSuccess($stmt->fetchAll());
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/courses$#', $path, $matches)) {
    EtudiantController::getCourses($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/grades$#', $path, $matches)) {
    EtudiantController::getGrades($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/attendance$#', $path, $matches)) {
    EtudiantController::getAttendance($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/schedule$#', $path, $matches)) {
    EtudiantController::getSchedule($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)/courses$#', $path, $matches)) {
    EnseignantController::getCourses($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)/schedule$#', $path, $matches)) {
    EnseignantController::getSchedule($matches[1]);
}

if ($path === '/api/schedule' && $method === 'GET') {
    EmploiDuTempsController::index();
}

if ($method === 'GET' && preg_match('#^/api/students/([0-9]+)/schedule$#', $path, $matches)) {
    EmploiDuTempsController::getStudentSchedule($matches[1]);
}

if ($method === 'GET' && preg_match('#^/api/teachers/([0-9]+)/schedule$#', $path, $matches)) {
    EmploiDuTempsController::getTeacherSchedule($matches[1]);
}

sendError('Route non trouvée', 404);
