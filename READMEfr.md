# HospitAll 🏥

Un système complet de gestion hospitalière construit avec des technologies web modernes, conçu pour rationaliser les opérations de santé et améliorer les soins aux patients.

[![GitHub](https://img.shields.io/badge/GitHub-Dépôt-blue)](https://github.com/5alvh/HospitAll)
[![Java](https://img.shields.io/badge/Java-Spring_Boot-green)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Base_de_Données-orange)](https://www.mysql.com/)

## 📋 Table des Matières

- [Aperçu Général](#aperçu-général)
- [Fonctionnalités](#fonctionnalités)
- [Stack Technologique](#stack-technologique)
- [Architecture du Système](#architecture-du-système)
- [Premiers Pas](#premiers-pas)
- [Documentation API](#documentation-api)
- [Schéma de Base de Données](#schéma-de-base-de-données)
- [Sécurité](#sécurité)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🎯 Aperçu Général

HospitAll est un système de gestion hospitalière full-stack qui digitalise et automatise les processus de santé. Il fournit des interfaces séparées pour les patients (clients) et les prestataires de soins (médecins) tout en maintenant une gestion sécurisée des données et une automatisation efficace des flux de travail.

### Objectifs Clés
- **Soins Centrés sur le Patient** : Réservation simplifiée de rendez-vous et accès aux dossiers médicaux
- **Efficacité du Prestataire** : Outils complets pour que les médecins gèrent les patients et les prescriptions
- **Sécurité des Données** : Mécanismes robustes d'authentification et d'autorisation
- **Automatisation des Processus** : Notifications automatisées, génération de PDF et gestion des flux de travail

## ✨ Fonctionnalités

### 👥 Gestion des Utilisateurs
- **Authentification Multi-Rôles** : Systèmes de connexion séparés pour clients et médecins
- **Gestion des Comptes** : Inscription, mises à jour de profil, changements de mot de passe
- **Contrôle du Statut des Comptes** : Capacités d'activation, suspension et désactivation
- **Récupération Sécurisée de Mot de Passe** : Système de réinitialisation de mot de passe basé sur des jetons

### 📅 Système de Rendez-vous
- **Réservation Intelligente** : Vérification en temps réel de la disponibilité et réservation de créneaux
- **Méthodes de Réservation Multiples** : Auto-réservation client et rendez-vous initiés par le médecin
- **Gestion des Statuts** : Cycle de vie complet des rendez-vous (programmé → confirmé → complété/annulé)
- **Gestion de Disponibilité** : Plannings dynamiques des médecins et gestion des créneaux horaires

### 💊 Gestion Médicale
- **Prescriptions Numériques** : Créer, mettre à jour et publier des prescriptions médicales
- **Résultats de Laboratoire** : Gestion et partage sécurisés des résultats de laboratoire
- **Dossiers Médicaux** : Suivi complet de l'historique des patients et des diagnostics
- **Génération de PDF** : Documents PDF professionnels pour prescriptions et résumés de rendez-vous

### 🏥 Opérations Hospitalières
- **Gestion des Départements** : Organiser les médecins par départements médicaux
- **Spécialisations des Médecins** : Suivi et gestion des spécialités médicales
- **Retours des Patients** : Système de collecte et gestion des commentaires
- **Système de Notifications** : Notifications en temps réel pour rendez-vous et mises à jour

### 📊 Fonctionnalités Avancées
- **Notifications en Temps Réel** : Notifications push pour mises à jour importantes
- **Gestion des Documents** : Manipulation sécurisée des documents médicaux
- **Tableau de Bord d'Analyse** : Statistiques des patients et métriques des rendez-vous
- **Adhésion Multi-niveaux** : Différents niveaux d'adhésion pour les clients

## 🛠 Stack Technologique

### Backend
- **Framework** : Spring Boot 3.x
- **Sécurité** : Spring Security avec authentification JWT
- **Base de Données** : MySQL avec JPA/Hibernate
- **Documentation** : Swagger/OpenAPI 3
- **Génération PDF** : Bibliothèque iText7
- **Validation** : Jakarta Bean Validation

### Frontend
- **Framework** : Angular (Version la plus récente)
- **Composants UI** : Design responsive moderne
- **Client HTTP** : Angular HttpClient pour communication API
- **Routage** : Angular Router pour navigation
- **Gestion d'État** : Services Angular et RxJS

### Base de Données
- **Base de Données Principale** : MySQL
- **ORM** : Hibernate/JPA
- **Pool de Connexions** : HikariCP
- **Migrations** : Flyway/Liquibase (recommandé)

### DevOps et Outils
- **Outil de Construction** : Maven
- **Contrôle de Version** : Git
- **Tests API** : Postman/Swagger UI
- **IDE** : IntelliJ IDEA/VS Code

## 🏗 Architecture du Système

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular UI    │    │  Spring Boot    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│ (Base de Données)│
│                 │    │                 │    │                 │
│ • Portail Client│    │ • APIs REST     │    │ • Données       │
│ • Portail Médecin│   │ • Sécurité      │    │   Utilisateur   │
│ • Panneau Admin │    │ • Logique       │    │ • Rendez-vous   │
│                 │    │   Métier        │    │ • Dossiers      │
│                 │    │                 │    │   Médicaux      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Composants Clés

#### Couche Contrôleurs
- `AuthController` : Gestion de l'authentification et connexion
- `ClientController` : Opérations patients/clients
- `DoctorController` : Fonctionnalités spécifiques aux médecins
- `AppointmentController` : Gestion du cycle de vie des rendez-vous
- `MedicalPrescriptionController` : Gestion des prescriptions
- `PdfController` : Services de génération de documents

#### Couche Sécurité
- Authentification basée sur JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Chiffrement des mots de passe avec BCrypt
- Validation du statut de compte (actif/suspendu/verrouillé)

#### Couche Services
- Implémentation de la logique métier
- Validation et traitement des données
- Notifications par email
- Génération de documents PDF

## 🚀 Premiers Pas

### Prérequis

- **Java** : JDK 17 ou supérieur
- **Node.js** : Version 16+ avec npm
- **MySQL** : Version 8.0+
- **Maven** : Version 3.6+
- **Git** : Version la plus récente

### Configuration du Backend

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd HospitAll
   ```

2. **Configurer la Base de Données MySQL**
   ```sql
   CREATE DATABASE hospitall;
   CREATE USER 'hospitall_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
   GRANT ALL PRIVILEGES ON hospitall.* TO 'hospitall_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Mettre à jour les Propriétés de l'Application**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=hospitall_user
   spring.datasource.password=votre_mot_de_passe
   
   # Configuration JWT
   jwt.secret=votre-clé-secrète
   jwt.expiration=86400000
   
   # Configuration Email (pour réinitialisation mot de passe)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=votre-email@gmail.com
   spring.mail.password=votre-mot-de-passe-app
   ```

4. **Exécuter le Backend**
   ```bash
   ./mvnw spring-boot:run
   ```

### Configuration du Frontend

1. **Naviguer vers le répertoire frontend**
   ```bash
   cd frontend  # Ajuster le chemin selon nécessaire
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les endpoints API**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

4. **Démarrer le serveur de développement**
   ```bash
   ng serve
   ```

### Accéder à l'Application

- **Frontend** : http://localhost:4200
- **API Backend** : http://localhost:8080
- **Documentation API** : http://localhost:8080/swagger-ui.html

## 📚 Documentation API

### Endpoints d'Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Connexion utilisateur |
| POST | `/auth/forgot-password` | Initier réinitialisation mot de passe |
| POST | `/auth/reset-password` | Réinitialiser mot de passe avec jeton |

### Gestion des Clients

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/clients/register` | Inscrire nouveau client |
| GET | `/clients/profile` | Obtenir profil client actuel |
| PUT | `/clients/{id}` | Mettre à jour informations client |
| GET | `/clients/appointments` | Obtenir rendez-vous du client |
| PUT | `/clients/change-password` | Changer mot de passe |

### Gestion des Médecins

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/doctors/register` | Inscrire nouveau médecin |
| GET | `/doctors/profile` | Obtenir profil médecin actuel |
| GET | `/doctors/all` | Obtenir tous les médecins |
| POST | `/doctors/available-doctors` | Obtenir médecins disponibles |
| POST | `/doctors/available-slots` | Obtenir créneaux disponibles |

### Gestion des Rendez-vous

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/appointment/book-appointment` | Réserver nouveau rendez-vous |
| GET | `/appointment/{id}` | Obtenir détails rendez-vous |
| PUT | `/appointment/{id}/cancel` | Annuler rendez-vous |
| PUT | `/appointment/{id}/confirm` | Confirmer rendez-vous |
| PUT | `/appointment/{id}/complete` | Marquer rendez-vous comme terminé |

### Services Médicaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/medical-prescriptions/create` | Créer prescription |
| GET | `/medical-prescriptions/get/{id}` | Obtenir prescription |
| PATCH | `/medical-prescriptions/publish/{id}` | Publier prescription |
| POST | `/lab-results/create` | Créer résultat laboratoire |
| GET | `/pdf/appointment/{id}` | Générer PDF rendez-vous |
| GET | `/pdf/medication-prescription/{id}` | Générer PDF prescription |

## 🗄 Schéma de Base de Données

### Entités Principales

#### Utilisateurs
- **Client** : Informations patient, niveaux d'adhésion, détails contact
- **Médecin** : Professionnels médicaux, spécialisations, départements, numéros de licence
- **Admin** : Administrateurs système (si applicable)

#### Dossiers Médicaux
- **RendezVous** : Détails réservation, statut, diagnostic, type
- **PrescriptionMédicale** : Détails médicament, dosage, durée
- **RésultatLaboratoire** : Résultats tests laboratoire et rapports
- **Département** : Départements médicaux et spécialités

#### Entités Système
- **Notification** : Notifications et alertes utilisateur
- **Commentaire** : Commentaires et évaluations patients
- **IntervalleTemps** : Créneaux rendez-vous disponibles

### Relations
- Client ↔ RendezVous (Un-à-Plusieurs)
- Médecin ↔ RendezVous (Un-à-Plusieurs)
- Médecin ↔ Département (Plusieurs-à-Un)
- Client ↔ PrescriptionMédicale (Un-à-Plusieurs)
- Médecin ↔ PrescriptionMédicale (Un-à-Plusieurs)

## 🔐 Sécurité

### Authentification et Autorisation
- **Jetons JWT** : Authentification sécurisée sans état
- **Accès Basé sur les Rôles** : Permissions séparées pour clients et médecins
- **Sécurité des Mots de Passe** : Hachage BCrypt avec sel
- **Gestion des Comptes** : Contrôle d'accès basé sur le statut (actif/suspendu/verrouillé)

### Sécurité API
- **Configuration CORS** : Requêtes cross-origin contrôlées
- **Validation des Requêtes** : Assainissement et validation des entrées
- **Gestion des Erreurs** : Messages d'erreur sécurisés sans exposition de données sensibles
- **Limitation de Débit** : Protection contre les abus (implémentation recommandée)

### Protection des Données
- **Chiffrement des Données Sensibles** : Dossiers médicaux et informations personnelles
- **Journalisation d'Audit** : Suivi accès aux données médicales sensibles
- **Gestion Sécurisée des Fichiers** : Génération PDF et stockage documents
- **Sécurité Base de Données** : Connexions chiffrées et requêtes paramétrées

## 🤝 Contribuer

Nous accueillons les contributions à HospitAll ! Veuillez suivre ces directives :

### Processus de Développement
1. Faire un fork du dépôt
2. Créer une branche fonctionnalité (`git checkout -b feature/fonctionnalite-geniale`)
3. Committer vos changements (`git commit -m 'Ajouter fonctionnalité géniale'`)
4. Pousser vers la branche (`git push origin feature/fonctionnalite-geniale`)
5. Ouvrir une Pull Request

### Standards de Codage
- Suivre les conventions de nommage Java
- Utiliser les principes appropriés de conception d'API REST
- Implémenter une gestion d'erreurs complète
- Ajouter des tests unitaires pour nouvelles fonctionnalités
- Mettre à jour la documentation pour changements d'API

### Rapports de Bugs
Lors du signalement de bugs, veuillez inclure :
- Description détaillée du problème
- Étapes pour reproduire
- Comportement attendu vs réel
- Détails environnement système
- Logs d'erreur (si applicable)

## 🙋‍♂️ Support

Pour support et questions :

- **GitHub Issues** : [Créer un issue](https://github.com/5alvh/HospitAll/issues)
- **Documentation** : Consulter la documentation API à `/swagger-ui.html`
- **Email** : Contacter l'équipe de développement

## 🎉 Remerciements

- Communauté Spring Boot pour l'excellente documentation
- Équipe Angular pour le framework frontend robuste
- iText7 pour les capacités de génération PDF
- MySQL pour le stockage de données fiable
- Tous les contributeurs qui ont aidé à construire ce système

---

**HospitAll** - Révolutionner la gestion hospitalière grâce à la technologie 🏥✨
