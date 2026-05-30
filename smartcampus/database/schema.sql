CREATE DATABASE IF NOT EXISTS smartcampus DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE smartcampus;

DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS schedule_slots;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL,
  telephone VARCHAR(30) DEFAULT '',
  date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE students (
  id_student INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT UNIQUE NOT NULL,
  date_naissance DATE DEFAULT NULL,
  niveau VARCHAR(50) DEFAULT '',
  annee_entree INT DEFAULT NULL,
  specialite VARCHAR(50) DEFAULT '',
  numero_etudiant VARCHAR(50) DEFAULT '',
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE teachers (
  id_teacher INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT UNIQUE NOT NULL,
  matiere VARCHAR(50) DEFAULT '',
  bureau VARCHAR(50) DEFAULT '',
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admins (
  id_admin INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT UNIQUE NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE courses (
  id_course INT PRIMARY KEY AUTO_INCREMENT,
  nom_cours VARCHAR(100) NOT NULL,
  description VARCHAR(250) DEFAULT '',
  capacite INT NOT NULL DEFAULT 20,
  semestre INT NOT NULL DEFAULT 1,
  matiere VARCHAR(100) DEFAULT '',
  niveau VARCHAR(50) DEFAULT '',
  credits INT NOT NULL DEFAULT 3,
  coefficient FLOAT NOT NULL DEFAULT 1,
  id_teacher INT NOT NULL,
  FOREIGN KEY (id_teacher) REFERENCES teachers(id_teacher) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE enrollments (
  id_enrollment INT PRIMARY KEY AUTO_INCREMENT,
  id_student INT NOT NULL,
  id_course INT NOT NULL,
  date_inscription DATE NOT NULL,
  statut ENUM('active','abandonnee','terminee') NOT NULL DEFAULT 'active',
  UNIQUE(id_student, id_course),
  FOREIGN KEY (id_student) REFERENCES students(id_student) ON DELETE CASCADE,
  FOREIGN KEY (id_course) REFERENCES courses(id_course) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE grades (
  id_grade INT PRIMARY KEY AUTO_INCREMENT,
  id_enrollment INT NOT NULL,
  id_teacher INT NULL,
  valeur FLOAT NOT NULL,
  type_evaluation VARCHAR(100) DEFAULT '',
  coef FLOAT NOT NULL DEFAULT 1,
  date_note DATE NOT NULL,
  locked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_enrollment) REFERENCES enrollments(id_enrollment) ON DELETE CASCADE,
  FOREIGN KEY (id_teacher) REFERENCES teachers(id_teacher) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE schedule_slots (
  id_slot INT PRIMARY KEY AUTO_INCREMENT,
  id_course INT NOT NULL,
  jour VARCHAR(20) NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  salle VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_course) REFERENCES courses(id_course) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attendance (
  id_attendance INT PRIMARY KEY AUTO_INCREMENT,
  id_enrollment INT NOT NULL,
  id_slot INT NOT NULL,
  date_presence DATE NOT NULL,
  statut ENUM('present','absent','justifie') NOT NULL,
  FOREIGN KEY (id_enrollment) REFERENCES enrollments(id_enrollment) ON DELETE CASCADE,
  FOREIGN KEY (id_slot) REFERENCES schedule_slots(id_slot) ON DELETE CASCADE
) ENGINE=InnoDB;
