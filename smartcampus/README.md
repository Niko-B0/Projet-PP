# SmartCampus

SmartCampus est une application web pédagogique pour la gestion académique d’étudiants, d’enseignants et de cours.

## Technologies utilisées
- Frontend : React avec Vite
- Backend : PHP
- Base de données : MySQL
- Communication : API REST JSON
- Authentification : sessions PHP
- Requêtes SQL : PDO avec requêtes préparées

## Prérequis
- PHP 8+
- MySQL
- Node.js 18+
- npm
- MAMP ou XAMPP recommandé

## Installation
1. Ouvrir un terminal.
2. Aller dans le dossier du projet :
```bash
cd smartcampus
```

### Base de données
1. Créez une base de données `smartcampus` dans MySQL.
2. Importez le fichier SQL :
```powershell
& 'c:\MAMP\bin\mysql\bin\mysql.exe' -uroot -proot smartcampus < database/schema.sql
```
3. Exécutez le script de données de test :
```powershell
$env:DB_USER = 'root'
$env:DB_PASS = 'root'
$env:DB_HOST = '127.0.0.1'
$env:DB_NAME = 'smartcampus'
& 'c:\MAMP\bin\php\php8.3.1\php.exe' database/seed.php
```

> Si votre installation MySQL utilise d’autres identifiants, adaptez `DB_USER` et `DB_PASS`.

### Lancer le backend
```powershell
$env:DB_USER = 'root'
$env:DB_PASS = 'root'
$env:DB_HOST = '127.0.0.1'
$env:DB_NAME = 'smartcampus'
& 'c:\MAMP\bin\php\php8.3.1\php.exe' -S localhost:8000 -t backend/public
```

### Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

## Comptes de test
- admin@smartcampus.local / password123
- teacher.dubois@smartcampus.local / password123
- teacher.martin@smartcampus.local / password123
- student.alice@smartcampus.local / password123
- student.tom@smartcampus.local / password123

## Fonctionnalités développées
- Authentification session PHP
- Dashboards par rôle
- Gestion des étudiants
- Gestion des enseignants
- Gestion des cours
- Inscriptions avec règles métier
- Saisie et consultation des notes
- Emploi du temps
- Présences

## Limites connues
- Application pédagogique simple
- Sécurité minimale pour usage local
- Pas de messagerie avancée
- Aucun PDF généré
