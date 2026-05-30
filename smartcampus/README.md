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
- Un serveur MySQL local : MAMP, XAMPP, WAMP, Laragon ou MySQL installé séparément

## Installation
1. Ouvrir un terminal.
2. Aller dans le dossier du projet :
```bash
cd smartcampus
```

### Base de données
1. Créez une base de données `smartcampus` dans MySQL.
2. Importez le fichier SQL :
```bash
mysql -u root -p smartcampus < database/schema.sql
```
3. Exécutez le script de données de test :
```bash
php database/seed.php
```

Sous Windows, vous pouvez aussi double-cliquer sur `database\seed.bat`.
Ce script cherche automatiquement PHP dans le PATH, MAMP, XAMPP, WAMP ou Laragon.

> Si votre installation MySQL utilise d’autres identifiants, adaptez `DB_USER` et `DB_PASS`.

### Lancer le backend
```bash
php -S localhost:8000 -t backend/public
```

Si votre base MySQL n’utilise pas les identifiants par défaut, définissez les variables d’environnement avant de lancer le backend :

PowerShell :
```powershell
$env:DB_HOST = '127.0.0.1'
$env:DB_NAME = 'smartcampus'
$env:DB_USER = 'root'
$env:DB_PASS = 'votre_mot_de_passe'
php -S localhost:8000 -t backend/public
```

Invite de commandes Windows :
```cmd
set DB_HOST=127.0.0.1
set DB_NAME=smartcampus
set DB_USER=root
set DB_PASS=votre_mot_de_passe
php -S localhost:8000 -t backend\public
```

### Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

### Lancement simple sous Windows
Pour une démonstration locale sans lancer deux serveurs :

1. Démarrez MySQL dans MAMP, XAMPP, WAMP ou Laragon.
2. Créez la base `smartcampus` et importez `database/schema.sql`.
3. Double-cliquez sur `database\seed.bat` pour ajouter les données de test.
4. Compilez le frontend une première fois :
```bash
cd frontend
npm install
npm run build
```
5. Revenez dans le dossier `smartcampus`, puis double-cliquez sur `start.bat`.
6. Le site est accessible sur `http://localhost:8000`.

`start.bat` cherche automatiquement PHP dans le PATH, MAMP, XAMPP, WAMP ou Laragon. Il sert le frontend compilé et l'API PHP avec le même serveur local.

## Comptes de test
- admin@smartcampus.local / password123
- teacher.dubois@smartcampus.local / password123
- teacher.martin@smartcampus.local / password123
- student.alice@smartcampus.local / password123
- student.tom@smartcampus.local / password123

## Scénario de démonstration
Pour vérifier la règle de conflit d'emploi du temps, connectez-vous avec `student.alice@smartcampus.local`.
Alice est déjà inscrite au cours `Intelligence Artificielle`, planifié le mardi de 10:00 à 12:00.
Dans la page d'inscription aux cours, essayez de l'inscrire à `Cybersecurite`, également planifié le mardi de 10:00 à 12:00.
L'API doit refuser l'inscription avec un message de conflit d'emploi du temps.

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
