# HospitAll 🏥

Un système de gestion hospitalière (SGH) complet conçu pour les petits centres de santé, offrant une gestion efficace des soins aux patients et des opérations de santé rationalisées.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technologique](#stack-technologique)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Informations API](#informations-api)
- [Contribution](#contribution)

## 🎯 Aperçu

HospitAll est un système de gestion hospitalière moderne basé sur le web, adapté aux petits centres de santé. Il fournit une solution complète pour la gestion des dossiers patients, des rendez-vous, des prescriptions médicales, des résultats de laboratoire et des flux de travail des prestataires de soins. Le système assure une communication efficace entre les patients et les prestataires de soins tout en maintenant des dossiers médicaux complets.

## ✨ Fonctionnalités

### 👨‍⚕️ Pour les Patients

#### Gestion de compte
- **Inscription utilisateur** : Créer de nouveaux comptes patients avec authentification sécurisée
- **Système de connexion** : Accès sécurisé au portail patient
- **Gestion de profil** : Mettre à jour les informations personnelles et les détails médicaux

#### Notifications
- **Notifications en temps réel** : Recevoir des mises à jour instantanées via WebSocket
- **Gestion des notifications** : Marquer les notifications comme lues/non lues
- **Historique des notifications** : Consulter l'historique complet des notifications

#### Rendez-vous
- **Réserver des rendez-vous** : Planifier des rendez-vous avec les médecins disponibles
- **Annuler des rendez-vous** : Annuler les rendez-vous programmés si nécessaire
- **Rendez-vous à venir** : Consulter les rendez-vous programmés avec pagination et filtres
- **Historique des rendez-vous** : Accéder à l'historique complet des rendez-vous avec fonctionnalité de recherche
- **Détails du rendez-vous** : Consulter les informations complètes du rendez-vous
- **Export PDF** : Télécharger les détails du rendez-vous au format PDF

#### Prescriptions médicales
- **Recevoir des prescriptions** : Obtenir des prescriptions numériques des médecins
- **Gestion des prescriptions** : Consulter toutes les prescriptions avec pagination et filtres
- **Détails des prescriptions** : Accéder aux informations détaillées des prescriptions
- **Export PDF** : Télécharger les prescriptions au format PDF

#### Résultats de laboratoire
- **Recevoir des résultats** : Obtenir les résultats de laboratoire numériquement
- **Gestion des résultats** : Consulter tous les résultats de laboratoire avec pagination et filtres
- **Export PDF** : Télécharger les résultats de laboratoire au format PDF

#### Système de feedback
- **Feedback général** : Donner un retour sur le centre de santé
- **Feedback spécifique au médecin** : Évaluer et examiner des médecins spécifiques
- **Gestion du feedback** : Consulter, mettre à jour et supprimer vos commentaires

### 👩‍⚕️ Pour les Médecins

#### Gestion de compte
- **Inscription médecin** : Créer des comptes de prestataires de soins
- **Système de connexion** : Accès sécurisé au portail médecin
- **Gestion de profil** : Gérer les informations professionnelles

#### Gestion des patients
- **Répertoire des patients** : Consulter tous les patients avec filtres avancés et pagination
- **Historique des patients** : Accéder à l'historique médical complet des patients
- **Dossiers médicaux** : Consulter les rendez-vous, résultats de laboratoire et prescriptions
- **Soins aux patients** : Planifier des rendez-vous, commander des tests de laboratoire et prescrire des médicaments
- **Gestion des dossiers** : Mettre à jour et supprimer les dossiers médicaux

#### Gestion des prescriptions
- **Créer des prescriptions** : Émettre des prescriptions numériques aux patients
- **Historique des prescriptions** : Consulter toutes les prescriptions émises avec filtres et pagination

#### Gestion des rendez-vous
- **Aperçu des rendez-vous** : Consulter tous les rendez-vous avec filtres et pagination
- **Gestion des plannings** : Gérer efficacement les plannings de rendez-vous

#### Analyse des feedbacks
- **Révision des feedbacks** : Consulter les commentaires des patients avec évaluations
- **Analyse des performances** : Suivre les évaluations moyennes et la satisfaction des patients

## 🛠 Stack technologique

### Backend
- **Framework** : Spring Boot 3.4.5
- **Version Java** : 21
- **Sécurité** : Spring Security avec authentification JWT
- **Base de données** : MySQL avec Spring Data JPA
- **Communication temps réel** : WebSocket (Spring WebSocket)
- **Service email** : Spring Mail
- **Génération PDF** : iText PDF
- **Documentation API** : OpenAPI 3 (Swagger)

#### Dépendances Backend
```xml
<!-- Core Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- JWT Authentication -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- PDF Generation -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>kernel</artifactId>
    <version>8.0.3</version>
</dependency>
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>layout</artifactId>
    <version>8.0.3</version>
</dependency>
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>io</artifactId>
    <version>8.0.3</version>
</dependency>

<!-- Documentation -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.8</version>
</dependency>

<!-- Database -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Development Tools -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Frontend
- **Framework** : Angular 19
- **Styles** : Tailwind CSS 4.0.17
- **Icônes** : Font Awesome 6.7.2
- **Communication temps réel** : STOMP.js avec SockJS
- **Notifications** : ngx-sonner
- **Alertes** : SweetAlert2
- **Rendu côté serveur** : Angular SSR

#### Dépendances Frontend
```json
{
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "@angular/platform-server": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@angular/ssr": "^19.0.5",
    "@fortawesome/angular-fontawesome": "^1.0.0",
    "@fortawesome/fontawesome-free": "^6.7.2",
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@stomp/stompjs": "^7.1.1",
    "@tailwindcss/postcss": "^4.0.17",
    "express": "^4.18.2",
    "ngx-sonner": "^3.1.0",
    "postcss": "^8.5.3",
    "rxjs": "~7.8.0",
    "sockjs-client": "^1.6.1",
    "sweetalert2": "^11.21.2",
    "tailwindcss": "^4.0.17",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  }
}
```

## 🏗 Architecture

```
HospitAll/
├── backend/                    # Application Spring Boot
│   ├── src/main/java/
│   │   └── com/tfg/back/
│   │       ├── annotations/  
│   │       ├── controller/  
│   │       ├── dto/         
│   │       ├── entity/      
│   │       ├── repository/  
│   │       ├── service/      
│   │       ├── configuration/      
│   │       ├── constants/      
│   │       ├── exceptions/
│   │       ├── mappers/       
│   │       ├── model/         
│   │       └── utils/  
│   └── src/main/resources/
│       ├── application.properties
│       └── static/
├── frontend/                   # Application Angular
    ├── src/app/
    │   ├── doctor/     
    │   ├── client/        
    │   ├── guards/           
    │   ├── models/            
    │   ├── services/           
    │   ├── shared/          
    │   └── interceptors/             
    └── src/assets/
```

## 🚀 Installation

### Prérequis
- Java 21 ou supérieur
- Node.js 18 ou supérieur
- MySQL 8.0 ou supérieur
- Maven 3.6 ou supérieur

### Configuration Backend

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd hospitall
   ```

2. **Configurer la base de données**
   ```bash
   # Créer la base de données MySQL
   mysql -u root -p
   CREATE DATABASE hospitall;
   ```

3. **Mettre à jour application.properties**
   ```properties
   # Configuration de la base de données
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=votre_nom_utilisateur
   spring.datasource.password=votre_mot_de_passe
   
   # Configuration JPA
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   
   # Configuration JWT
   jwt.secret=votre_clé_secrète_jwt
   jwt.expiration=86400000
   
   # Configuration Email
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=votre_email@gmail.com
   spring.mail.password=votre_mot_de_passe_app
   ```

4. **Construire et exécuter le backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Configuration Frontend

1. **Naviguer vers le répertoire frontend**
   ```bash
   cd frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

4. **Démarrer le serveur de développement**
   ```bash
   ng serve
   ```

## 🎯 Utilisation

### Accéder à l'application

- **Frontend** : http://localhost:4200
- **API Backend** : http://localhost:8080/api
- **Documentation API** : http://localhost:8080/swagger-ui.html

### Comptes par défaut

#### Compte Patient
- Email : patient@example.com
- Mot de passe : password123

#### Compte Médecin
- Email : doctor@example.com
- Mot de passe : password123

### Flux de travail clés

#### Parcours Patient
1. S'inscrire/Se connecter au portail patient
2. Compléter les informations de profil
3. Réserver des rendez-vous avec les médecins disponibles
4. Recevoir des notifications en temps réel
5. Accéder aux dossiers médicaux et prescriptions
6. Télécharger les rapports PDF
7. Donner un feedback

#### Parcours Médecin
1. Se connecter au portail médecin
2. Consulter les patients assignés
3. Gérer les rendez-vous et plannings
4. Émettre des prescriptions et commandes de laboratoire
5. Examiner les commentaires des patients
6. Générer des rapports médicaux

## 📚 Informations API

La documentation API est automatiquement générée avec OpenAPI 3 et peut être consultée à :
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **OpenAPI JSON** : http://localhost:8080/v3/api-docs

### Points de terminaison API principaux

#### SERA DISPONIBLE BIENTÔT

## 🧪 Tests

### Tests Backend
```bash
cd backend
mvn test
```

### Tests Frontend
```bash
cd frontend
ng test
```

## 🤝 Contribution

Nous accueillons les contributions à HospitAll ! Veuillez suivre ces étapes :

1. Forker le dépôt
2. Créer une branche de fonctionnalité (`git checkout -b feature/NouvelleFonctionnalité`)
3. Commiter vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/NouvelleFonctionnalité`)
5. Ouvrir une Pull Request

### Directives de développement
- Suivre les meilleures pratiques de Spring Boot pour le développement backend
- Utiliser le guide de style Angular pour le développement frontend
- Écrire des tests complets pour les nouvelles fonctionnalités
- Mettre à jour la documentation pour les changements d'API
- S'assurer que le code est correctement formaté et vérifié

## 🆘 Support

Pour le support et les questions :
- Créer une issue dans le dépôt GitHub
- Email : salahforquestions@gmail.com

## 🎉 Remerciements

- L'équipe Spring Boot pour l'excellent framework
- L'équipe Angular pour le framework frontend robuste
- iText pour les capacités de génération PDF
- Tous les contributeurs qui ont aidé à rendre ce projet possible

---

**HospitAll** - Autonomiser les petits centres de santé avec la technologie moderne 🏥✨
