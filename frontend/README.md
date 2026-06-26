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
- Base de donnees : SQLite (developpement)

---

## Analyse fonctionnelle

### Acteurs

| Acteur | Description |
|--------|-------------|
| Etudiant | Cree des projets, gere les taches, soumet des livrables |
| Enseignant | Consulte les projets, evalue les livrables des etudiants |
| Administrateur | Gere tous les utilisateurs, projets, taches et evaluations |

### Cas d utilisation

#### Etudiant
- S authentifier avec username et password
- Creer un projet avec titre et description
- Ajouter des membres a un projet
- Creer des taches dans un projet avec priorite (basse, moyenne, haute)
- Modifier le statut d une tache (a_faire, en_cours, terminee)
- Soumettre un livrable avec un lien de fichier
- Consulter les notes et appreciations de ses livrables

#### Enseignant
- S authentifier avec username et password
- Consulter tous les projets des etudiants
- Consulter toutes les taches
- Evaluer un livrable avec une note (0-20) et un commentaire
- Consulter toutes les evaluations qu il a donnees

#### Administrateur
- S authentifier avec username et password
- Gerer tous les utilisateurs (creer, modifier, supprimer)
- Consulter tous les projets, taches, livrables et evaluations
- Creer des projets et des evaluations
- Acceder aux statistiques globales de la plateforme

### Regles metier

1. Un etudiant ne peut pas evaluer un livrable
2. Un enseignant ne peut pas creer de projet
3. Un livrable ne peut avoir qu une seule evaluation (relation OneToOne)
4. La note d une evaluation doit etre comprise entre 0 et 20
5. Seul un utilisateur authentifie peut acceder aux ressources de l API
6. Un etudiant ne voit que ses propres projets et livrables
7. Un enseignant voit tous les projets et livrables de tous les etudiants
8. L administrateur a acces a toutes les ressources sans restriction
9. Le token JWT expire apres 60 minutes et doit etre rafraichi
10. Un projet peut avoir plusieurs membres (relation ManyToMany)

---

## Conception de la base de donnees

### Tables et relations

#### Table User (core_user)
| Champ | Type | Contrainte |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY AUTO |
| username | VARCHAR(150) | UNIQUE NOT NULL |
| password | VARCHAR(128) | NOT NULL |
| email | VARCHAR(254) | - |
| first_name | VARCHAR(150) | - |
| last_name | VARCHAR(150) | - |
| role | VARCHAR(20) | CHOICES: etudiant, enseignant, administrateur |
| is_active | BOOLEAN | DEFAULT True |

#### Table Projet (core_projet)
| Champ | Type | Contrainte |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY AUTO |
| titre | VARCHAR(200) | NOT NULL |
| description | TEXT | - |
| createur_id | INTEGER | FK -> User ON DELETE CASCADE |
| statut | VARCHAR(20) | CHOICES: en_cours, termine, en_pause |
| date_creation | DATETIME | AUTO NOW ADD |
| date_fin_prevue | DATE | NULL |

#### Table Projet_Membres (core_projet_membres)
| Champ | Type | Contrainte |
|-------|------|------------|
| projet_id | INTEGER | FK -> Projet |
| user_id | INTEGER | FK -> User |

#### Table Tache (core_tache)
| Champ | Type | Contrainte |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY AUTO |
| titre | VARCHAR(200) | NOT NULL |
| description | TEXT | - |
| projet_id | INTEGER | FK -> Projet ON DELETE CASCADE |
| assigne_a_id | INTEGER | FK -> User ON DELETE SET NULL |
| statut | VARCHAR(20) | CHOICES: a_faire, en_cours, terminee |
| priorite | VARCHAR(10) | CHOICES: basse, moyenne, haute |
| date_creation | DATETIME | AUTO NOW ADD |
| date_echeance | DATE | NULL |

#### Table Livrable (core_livrable)
| Champ | Type | Contrainte |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY AUTO |
| titre | VARCHAR(200) | NOT NULL |
| description | TEXT | - |
| fichier_url | URL | - |
| projet_id | INTEGER | FK -> Projet ON DELETE CASCADE |
| soumis_par_id | INTEGER | FK -> User ON DELETE CASCADE |
| date_soumission | DATETIME | AUTO NOW ADD |

#### Table Evaluation (core_evaluation)
| Champ | Type | Contrainte |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY AUTO |
| livrable_id | INTEGER | FK -> Livrable UNIQUE (OneToOne) |
| enseignant_id | INTEGER | FK -> User ON DELETE CASCADE |
| note | DECIMAL(4,2) | BETWEEN 0 AND 20 |
| commentaire | TEXT | - |
| date_evaluation | DATETIME | AUTO NOW ADD |

### Relations
- User -> Projet : OneToMany (un user cree plusieurs projets)
- Projet -> User : ManyToMany (un projet a plusieurs membres)
- Projet -> Tache : OneToMany (un projet a plusieurs taches)
- Tache -> User : ManyToOne (une tache assignee a un user)
- Projet -> Livrable : OneToMany (un projet a plusieurs livrables)
- Livrable -> Evaluation : OneToOne (un livrable a une seule evaluation)

---

## Installation

### Prerequis
- Python 3.10+
- Node.js 18+

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
Copier .env.example en .env et remplir les valeurs :
SECRET_KEY=

DEBUG=

ALLOWED_HOSTS=

## Endpoints API

### Authentification
- POST /api/token/ : Obtenir un token JWT
- POST /api/token/refresh/ : Rafraichir le token

### Utilisateurs
- GET /api/users/ : Liste des utilisateurs (admin)
- POST /api/users/ : Creer un compte
- GET /api/users/me/ : Profil connecte

### Projets
- GET /api/projets/ : Liste des projets
- POST /api/projets/ : Creer un projet (etudiant/admin)
- GET /api/projets/id/ : Detail d un projet
- PUT /api/projets/id/ : Modifier un projet
- DELETE /api/projets/id/ : Supprimer un projet
- POST /api/projets/id/ajouter_membre/ : Ajouter un membre
- POST /api/projets/id/retirer_membre/ : Retirer un membre

### Taches
- GET /api/taches/ : Liste des taches
- POST /api/taches/ : Creer une tache
- PATCH /api/taches/id/ : Modifier le statut
- DELETE /api/taches/id/ : Supprimer une tache
- GET /api/taches/mes_taches/ : Mes taches assignees

### Livrables
- GET /api/livrables/ : Liste des livrables
- POST /api/livrables/ : Soumettre un livrable
- DELETE /api/livrables/id/ : Supprimer un livrable

### Evaluations
- GET /api/evaluations/ : Liste des evaluations
- POST /api/evaluations/ : Creer une evaluation (enseignant/admin)

### Statistiques
- GET /api/statistiques/ : Statistiques par role

## Documentation API
Swagger UI : http://127.0.0.1:8000/api/docs/

## Comptes de demonstration
| Role | Username | Password |
|------|----------|----------|
| Administrateur | admin2 | demo1234 |
| Etudiant | etudiant1 | demo1234 |
| Etudiant | etudiant2 | demo1234 |
| Enseignant | enseignant1 | demo1234 |

## Auteur
Godson - https://github.com/Godson236

## Licence
Projet academique 2026