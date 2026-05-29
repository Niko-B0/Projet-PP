<?php

$host = getenv('DB_HOST') ?: '127.0.0.1';
$db = getenv('DB_NAME') ?: 'smartcampus';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $exception) {
    echo "Erreur de connexion à la base de données : " . $exception->getMessage() . PHP_EOL;
    exit(1);
}

function addUser(PDO $pdo, $nom, $prenom, $email, $role, $telephone = '') {
    $stmt = $pdo->prepare('SELECT id_user FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    if ($user) {
        return $user['id_user'];
    }
    $stmt = $pdo->prepare('INSERT INTO users (nom, prenom, email, mot_de_passe, role, telephone, date_creation) VALUES (:nom, :prenom, :email, :mot_de_passe, :role, :telephone, NOW())');
    $stmt->execute([
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'mot_de_passe' => password_hash('password123', PASSWORD_DEFAULT),
        'role' => $role,
        'telephone' => '',
    ]);
    return $pdo->lastInsertId();
}

function addStudent(PDO $pdo, $id_user, $date_naissance, $niveau, $annee_entree, $specialite, $numero_etudiant) {
    $stmt = $pdo->prepare('SELECT id_student FROM students WHERE id_user = :id_user');
    $stmt->execute(['id_user' => $id_user]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO students (id_user, date_naissance, niveau, annee_entree, specialite, numero_etudiant) VALUES (:id_user, :date_naissance, :niveau, :annee_entree, :specialite, :numero_etudiant)');
    $stmt->execute([
        'id_user' => $id_user,
        'date_naissance' => $date_naissance,
        'niveau' => $niveau,
        'annee_entree' => $annee_entree,
        'specialite' => $specialite,
        'numero_etudiant' => $numero_etudiant,
    ]);
}

function addTeacher(PDO $pdo, $id_user, $matiere, $bureau) {
    $stmt = $pdo->prepare('SELECT id_teacher FROM teachers WHERE id_user = :id_user');
    $stmt->execute(['id_user' => $id_user]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO teachers (id_user, matiere, bureau) VALUES (:id_user, :matiere, :bureau)');
    $stmt->execute([
        'id_user' => $id_user,
        'matiere' => $matiere,
        'bureau' => $bureau,
    ]);
}

function addAdmin(PDO $pdo, $id_user) {
    $stmt = $pdo->prepare('SELECT id_admin FROM admins WHERE id_user = :id_user');
    $stmt->execute(['id_user' => $id_user]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO admins (id_user) VALUES (:id_user)');
    $stmt->execute(['id_user' => $id_user]);
}

function addCourse(PDO $pdo, $nom_cours, $description, $capacite, $semestre, $matiere, $niveau, $credits, $coefficient, $id_teacher) {
    $stmt = $pdo->prepare('SELECT id_course FROM courses WHERE nom_cours = :nom_cours AND id_teacher = :id_teacher');
    $stmt->execute(['nom_cours' => $nom_cours, 'id_teacher' => $id_teacher]);
    $course = $stmt->fetch();
    if ($course) {
        return $course['id_course'];
    }
    $stmt = $pdo->prepare('INSERT INTO courses (nom_cours, description, capacite, semestre, matiere, niveau, credits, coefficient, id_teacher) VALUES (:nom_cours, :description, :capacite, :semestre, :matiere, :niveau, :credits, :coefficient, :id_teacher)');
    $stmt->execute(compact('nom_cours', 'description', 'capacite', 'semestre', 'matiere', 'niveau', 'credits', 'coefficient', 'id_teacher'));
    return $pdo->lastInsertId();
}

function addSchedule(PDO $pdo, $id_course, $jour, $heure_debut, $heure_fin, $salle) {
    $stmt = $pdo->prepare('SELECT id_slot FROM schedule_slots WHERE id_course = :id_course AND jour = :jour AND heure_debut = :heure_debut');
    $stmt->execute(['id_course' => $id_course, 'jour' => $jour, 'heure_debut' => $heure_debut]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO schedule_slots (id_course, jour, heure_debut, heure_fin, salle) VALUES (:id_course, :jour, :heure_debut, :heure_fin, :salle)');
    $stmt->execute(compact('id_course', 'jour', 'heure_debut', 'heure_fin', 'salle'));
}

function addEnrollment(PDO $pdo, $id_student, $id_course, $statut = 'active') {
    $stmt = $pdo->prepare('SELECT id_enrollment FROM enrollments WHERE id_student = :id_student AND id_course = :id_course');
    $stmt->execute(['id_student' => $id_student, 'id_course' => $id_course]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO enrollments (id_student, id_course, date_inscription, statut) VALUES (:id_student, :id_course, CURDATE(), :statut)');
    $stmt->execute(['id_student' => $id_student, 'id_course' => $id_course, 'statut' => $statut]);
    return $pdo->lastInsertId();
}

function addGrade(PDO $pdo, $id_enrollment, $id_teacher, $valeur, $type_evaluation, $coef = 1, $locked = false) {
    $stmt = $pdo->prepare('SELECT id_grade FROM grades WHERE id_enrollment = :id_enrollment AND type_evaluation = :type_evaluation');
    $stmt->execute(['id_enrollment' => $id_enrollment, 'type_evaluation' => $type_evaluation]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO grades (id_enrollment, id_teacher, valeur, type_evaluation, coef, date_note, locked) VALUES (:id_enrollment, :id_teacher, :valeur, :type_evaluation, :coef, CURDATE(), :locked)');
    $stmt->execute(['id_enrollment' => $id_enrollment, 'id_teacher' => $id_teacher, 'valeur' => $valeur, 'type_evaluation' => $type_evaluation, 'coef' => $coef, 'locked' => $locked]);
}

function addAttendance(PDO $pdo, $id_enrollment, $id_slot, $statut) {
    $stmt = $pdo->prepare('SELECT id_attendance FROM attendance WHERE id_enrollment = :id_enrollment AND id_slot = :id_slot');
    $stmt->execute(['id_enrollment' => $id_enrollment, 'id_slot' => $id_slot]);
    if ($stmt->fetch()) {
        return;
    }
    $stmt = $pdo->prepare('INSERT INTO attendance (id_enrollment, id_slot, date_presence, statut) VALUES (:id_enrollment, :id_slot, CURDATE(), :statut)');
    $stmt->execute(['id_enrollment' => $id_enrollment, 'id_slot' => $id_slot, 'statut' => $statut]);
}

$adminId = addUser($pdo, 'Admin', 'Smart', 'admin@smartcampus.local', 'admin');
addAdmin($pdo, $adminId);

$teacher1 = addUser($pdo, 'Dubois', 'Claire', 'teacher.dubois@smartcampus.local', 'teacher');
addTeacher($pdo, $teacher1, 'Mathématiques', 'Bureau 12');
$teacher2 = addUser($pdo, 'Martin', 'Paul', 'teacher.martin@smartcampus.local', 'teacher');
addTeacher($pdo, $teacher2, 'Informatique', 'Bureau 23');

$student1 = addUser($pdo, 'Alice', 'Dupont', 'student.alice@smartcampus.local', 'student');
addStudent($pdo, $student1, '2003-05-18', 'Licence 2', 2021, 'Génie logiciel', 'S1001');
$student2 = addUser($pdo, 'Tom', 'Bernard', 'student.tom@smartcampus.local', 'student');
addStudent($pdo, $student2, '2002-09-03', 'Licence 3', 2020, 'Systèmes d’information', 'S1002');
$student3 = addUser($pdo, 'Lucie', 'Fabre', 'student.lucie@smartcampus.local', 'student');
addStudent($pdo, $student3, '2004-01-27', 'Licence 1', 2023, 'Mathematiques appliquées', 'S1003');
$student4 = addUser($pdo, 'Hugo', 'Garnier', 'student.hugo@smartcampus.local', 'student');
addStudent($pdo, $student4, '2003-11-12', 'Licence 2', 2021, 'Réseaux', 'S1004');

$pdo->beginTransaction();
try {
    $teacherId1 = $pdo->query('SELECT id_teacher FROM teachers WHERE id_user = ' . $teacher1)->fetchColumn();
    $teacherId2 = $pdo->query('SELECT id_teacher FROM teachers WHERE id_user = ' . $teacher2)->fetchColumn();

    $course1 = addCourse($pdo, 'Programmation Web', 'Cours de base sur le web et les API.', 30, 2, 'Informatique', 'Licence 2', 4, 1, $teacherId2);
    $course2 = addCourse($pdo, 'Algèbre Linéaire', 'Fondamentaux de l’algèbre pour informatique.', 25, 2, 'Mathématiques', 'Licence 2', 5, 1.2, $teacherId1);
    $course3 = addCourse($pdo, 'Base de données', 'Modélisation et SQL avec MySQL.', 25, 2, 'Informatique', 'Licence 2', 4, 1, $teacherId2);
    $course4 = addCourse($pdo, 'Analyse Numérique', 'Méthodes numériques et applications.', 20, 3, 'Mathématiques', 'Licence 3', 4, 1.1, $teacherId1);
    $course5 = addCourse($pdo, 'Réseaux', 'Architecture des réseaux et protocoles.', 28, 2, 'Informatique', 'Licence 2', 3, 0.9, $teacherId2);

    addSchedule($pdo, $course1, 'Lundi', '09:00', '11:00', 'Salle A1');
    addSchedule($pdo, $course1, 'Mercredi', '10:00', '12:00', 'Salle A1');
    addSchedule($pdo, $course2, 'Mardi', '08:00', '10:00', 'Salle B2');
    addSchedule($pdo, $course3, 'Jeudi', '14:00', '16:00', 'Salle C3');
    addSchedule($pdo, $course4, 'Vendredi', '10:00', '12:00', 'Salle D4');
    addSchedule($pdo, $course5, 'Mercredi', '14:00', '16:00', 'Salle B2');

    $studentId1 = $pdo->query('SELECT id_student FROM students WHERE id_user = ' . $student1)->fetchColumn();
    $studentId2 = $pdo->query('SELECT id_student FROM students WHERE id_user = ' . $student2)->fetchColumn();
    $studentId3 = $pdo->query('SELECT id_student FROM students WHERE id_user = ' . $student3)->fetchColumn();
    $studentId4 = $pdo->query('SELECT id_student FROM students WHERE id_user = ' . $student4)->fetchColumn();

    $enroll1 = addEnrollment($pdo, $studentId1, $course1);
    $enroll2 = addEnrollment($pdo, $studentId1, $course3);
    $enroll3 = addEnrollment($pdo, $studentId2, $course1);
    $enroll4 = addEnrollment($pdo, $studentId2, $course2);
    $enroll5 = addEnrollment($pdo, $studentId3, $course5);
    $enroll6 = addEnrollment($pdo, $studentId4, $course2);
    $enroll7 = addEnrollment($pdo, $studentId4, $course3);

    addGrade($pdo, $enroll1, $teacherId2, 14.5, 'Contrôle continu', 1);
    addGrade($pdo, $enroll2, $teacherId2, 12.0, 'Projet', 1.5);
    addGrade($pdo, $enroll3, $teacherId2, 16.0, 'Contrôle', 1);
    addGrade($pdo, $enroll4, $teacherId1, 11.5, 'Devoir', 1);
    addGrade($pdo, $enroll5, $teacherId2, 15.0, 'Partiel', 1.2);

    $slot1 = $pdo->query('SELECT id_slot FROM schedule_slots WHERE id_course = ' . $course1 . ' LIMIT 1')->fetchColumn();
    $slot2 = $pdo->query('SELECT id_slot FROM schedule_slots WHERE id_course = ' . $course2 . ' LIMIT 1')->fetchColumn();
    addAttendance($pdo, $enroll1, $slot1, 'present');
    addAttendance($pdo, $enroll2, $slot1, 'absent');
    addAttendance($pdo, $enroll3, $slot1, 'justifie');
    addAttendance($pdo, $enroll4, $slot2, 'present');

    $pdo->commit();
    echo "Données de test créées avec succès." . PHP_EOL;
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Échec de l’initialisation des données : " . $e->getMessage() . PHP_EOL;
    exit(1);
}
