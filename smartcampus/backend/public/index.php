<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';
require_once __DIR__ . '/../controllers/AuthentificationController.php';
require_once __DIR__ . '/../controllers/EtudiantController.php';
require_once __DIR__ . '/../controllers/EnseignantController.php';
require_once __DIR__ . '/../controllers/CoursController.php';
require_once __DIR__ . '/../controllers/InscriptionController.php';
require_once __DIR__ . '/../controllers/NoteController.php';
require_once __DIR__ . '/../controllers/PresenceController.php';
require_once __DIR__ . '/../controllers/EmploiDuTempsController.php';
require_once __DIR__ . '/../routes/api.php';
