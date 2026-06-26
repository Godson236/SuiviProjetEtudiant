# SuiviProjetEtudiant

## Description
Application web de gestion de projets de groupe en milieu universitaire.
Les etudiants creent des projets, repartissent les taches entre membres et suivent l avancement.
Les enseignants consultent la progression et evaluent les livrables.

## Stack technique
- Backend : Django 5 + Django REST Framework
- Authentification : JWT (djangorestframework-simplejwt)
- Documentation API : Swagger UI (drf-spectacular)
- Frontend : React.js + Axios + React Router
- Base de donnees : SQLite

## Installation

### Backend
git clone https://github.com/Godson236/SuiviProjetEtudiant.git
cd SuiviProjetEtudiant
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver

### Frontend
cd frontend
npm install
npm start

## Variables d environnement
Copier .env.example en .env et remplir les valeurs
SECRET_KEY=
DEBUG=
ALLOWED_HOSTS=

## Endpoints API

### Authentification
POST /api/token/ - Obtenir un token JWT
POST /api/token/refresh/ - Rafraichir le token

### Utilisateurs
GET /api/users/ - Liste des utilisateurs (admin)
POST /api/users/ - Creer un compte
GET /api/users/me/ - Profil connecte

### Projets
GET /api/projets/ - Liste des projets
POST /api/projets/ - Creer un projet
GET /api/projets/id/ - Detail d un projet
PUT /api/projets/id/ - Modifier un projet
DELETE /api/projets/id/ - Supprimer un projet
POST /api/projets/id/ajouter_membre/ - Ajouter un membre
POST /api/projets/id/retirer_membre/ - Retirer un membre

### Taches
GET /api/taches/ - Liste des taches
POST /api/taches/ - Creer une tache
PATCH /api/taches/id/ - Modifier le statut
DELETE /api/taches/id/ - Supprimer une tache

### Livrables
GET /api/livrables/ - Liste des livrables
POST /api/livrables/ - Soumettre un livrable
DELETE /api/livrables/id/ - Supprimer un livrable

### Evaluations
GET /api/evaluations/ - Liste des evaluations
POST /api/evaluations/ - Creer une evaluation

### Statistiques
GET /api/statistiques/ - Statistiques par role

## Comptes de demonstration
- Administrateur : admin / admin1234
- Etudiant : etudiant1 / demo1234
- Etudiant : etudiant2 / demo1234
- Enseignant : enseignant1 / demo1234

## Documentation API
Swagger UI disponible sur http://127.0.0.1:8000/api/docs/

## Auteur
Godson - https://github.com/Godson236

## Licence
Projet academique 2026