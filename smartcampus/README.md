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
- Un serveur MySQL local : MAMP, XAMPP, WAMP, Laragon ou MySQL installé séparément
- Node.js et npm seulement si vous souhaitez modifier puis recompiler le frontend React

## Installation et lancement sous Windows

### 1. Démarrer le serveur local
Lancez MAMP, XAMPP, WAMP ou Laragon, puis démarrez MySQL.

### 2. Créer la base de données
Ouvrez phpMyAdmin depuis votre serveur local.

Créez une nouvelle base de données nommée :

```text
smartcampus
```

### 3. Importer les tables
Dans phpMyAdmin, sélectionnez la base `smartcampus`.

Allez dans l'onglet **Importer**, puis choisissez le fichier :

```text
database/schema.sql
```

Validez l'import.

### 4. Ajouter les données de test
Dans l'explorateur Windows, ouvrez le dossier du projet `smartcampus`.

Double-cliquez sur le fichier :

```text
database/seed.bat
```

Ce script remplit la base avec les comptes de test, les cours, les inscriptions, les notes, les présences et les créneaux.

### 5. Lancer le site
Dans le dossier `smartcampus`, double-cliquez sur :

```text
start.bat
```

Le site s'ouvre ensuite dans le navigateur à l'adresse :

```text
http://localhost:8000
```

Gardez la fenêtre noire ouverte pendant l'utilisation du site.

### Remarque pour les développeurs
Le dossier `frontend/dist` est déjà fourni, donc Node.js n'est pas nécessaire pour simplement lancer le site.

Si vous modifiez le code React dans `frontend/src`, il faut alors recompiler le frontend avec npm avant de relancer `start.bat`.

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
