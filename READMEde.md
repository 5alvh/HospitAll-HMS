# HospitAll 🏥

Ein umfassendes Krankenhaus-Management-System (KMS) für kleine Gesundheitszentren, das effiziente Patientenversorgung und optimierte Gesundheitsabläufe bietet.

## 📋 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Funktionen](#funktionen)
- [Technologie-Stack](#technologie-stack)
- [Architektur](#architektur)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [API-Informationen](#api-informationen)
- [Mitwirkung](#mitwirkung)

## 🎯 Überblick

HospitAll ist ein modernes, webbasiertes Krankenhaus-Management-System, das auf kleine Gesundheitszentren zugeschnitten ist. Es bietet eine umfassende Lösung für die Verwaltung von Patientenakten, Terminen, medizinischen Verschreibungen, Laborergebnissen und Arbeitsabläufen von Gesundheitsdienstleistern. Das System gewährleistet eine effiziente Kommunikation zwischen Patienten und Gesundheitsdienstleistern bei gleichzeitiger Führung vollständiger medizinischer Aufzeichnungen.

## ✨ Funktionen

### 👨‍⚕️ Für Patienten

#### Kontoverwaltung
- **Benutzerregistrierung**: Erstellung neuer Patientenkonten mit sicherer Authentifizierung
- **Anmeldesystem**: Sicherer Zugang zum Patientenportal
- **Profilverwaltung**: Aktualisierung persönlicher Informationen und medizinischer Details

#### Benachrichtigungen
- **Echtzeitbenachrichtigungen**: Sofortige Updates über WebSocket erhalten
- **Benachrichtigungsverwaltung**: Benachrichtigungen als gelesen/ungelesen markieren
- **Benachrichtigungshistorie**: Vollständige Benachrichtigungshistorie anzeigen

#### Termine
- **Termine buchen**: Termine mit verfügbaren Ärzten planen
- **Termine stornieren**: Geplante Termine bei Bedarf stornieren
- **Bevorstehende Termine**: Geplante Termine mit Paginierung und Filtern anzeigen
- **Terminhistorie**: Vollständige Terminhistorie mit Suchfunktion abrufen
- **Termindetails**: Vollständige Termininformationen anzeigen
- **PDF-Export**: Termindetails im PDF-Format herunterladen

#### Medizinische Verschreibungen
- **Verschreibungen erhalten**: Digitale Verschreibungen von Ärzten erhalten
- **Verschreibungsverwaltung**: Alle Verschreibungen mit Paginierung und Filtern anzeigen
- **Verschreibungsdetails**: Detaillierte Verschreibungsinformationen abrufen
- **PDF-Export**: Verschreibungen im PDF-Format herunterladen

#### Laborergebnisse
- **Ergebnisse erhalten**: Laborergebnisse digital erhalten
- **Ergebnisverwaltung**: Alle Laborergebnisse mit Paginierung und Filtern anzeigen
- **PDF-Export**: Laborergebnisse im PDF-Format herunterladen

#### Feedback-System
- **Allgemeines Feedback**: Feedback zum Gesundheitszentrum geben
- **Arztspezifisches Feedback**: Spezifische Ärzte bewerten und rezensieren
- **Feedback-Verwaltung**: Ihre Kommentare anzeigen, aktualisieren und löschen

### 👩‍⚕️ Für Ärzte

#### Kontoverwaltung
- **Arztregistrierung**: Konten für Gesundheitsdienstleister erstellen
- **Anmeldesystem**: Sicherer Zugang zum Arztportal
- **Profilverwaltung**: Berufliche Informationen verwalten

#### Patientenverwaltung
- **Patientenverzeichnis**: Alle Patienten mit erweiterten Filtern und Paginierung anzeigen
- **Patientenhistorie**: Vollständige medizinische Patientenhistorie abrufen
- **Medizinische Aufzeichnungen**: Termine, Laborergebnisse und Verschreibungen anzeigen
- **Patientenversorgung**: Termine planen, Labortests anordnen und Medikamente verschreiben
- **Datensatzverwaltung**: Medizinische Aufzeichnungen aktualisieren und löschen

#### Verschreibungsverwaltung
- **Verschreibungen erstellen**: Digitale Verschreibungen an Patienten ausstellen
- **Verschreibungshistorie**: Alle ausgestellten Verschreibungen mit Filtern und Paginierung anzeigen

#### Terminverwaltung
- **Terminübersicht**: Alle Termine mit Filtern und Paginierung anzeigen
- **Terminplanung**: Terminpläne effizient verwalten

#### Feedback-Analyse
- **Feedback-Überprüfung**: Patientenfeedback mit Bewertungen anzeigen
- **Leistungsanalyse**: Durchschnittsbewertungen und Patientenzufriedenheit verfolgen

## 🛠 Technologie-Stack

### Backend
- **Framework**: Spring Boot 3.4.5
- **Java-Version**: 21
- **Sicherheit**: Spring Security mit JWT-Authentifizierung
- **Datenbank**: MySQL mit Spring Data JPA
- **Echtzeitkommunikation**: WebSocket (Spring WebSocket)
- **E-Mail-Service**: Spring Mail
- **PDF-Generierung**: iText PDF
- **API-Dokumentation**: OpenAPI 3 (Swagger)

#### Backend-Abhängigkeiten
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
- **Framework**: Angular 19
- **Stile**: Tailwind CSS 4.0.17
- **Icons**: Font Awesome 6.7.2
- **Echtzeitkommunikation**: STOMP.js mit SockJS
- **Benachrichtigungen**: ngx-sonner
- **Alarme**: SweetAlert2
- **Server-Side Rendering**: Angular SSR

#### Frontend-Abhängigkeiten
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

## 🏗 Architektur

```
HospitAll/
├── backend/                    # Spring Boot-Anwendung
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
├── frontend/                   # Angular-Anwendung
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

### Voraussetzungen
- Java 21 oder höher
- Node.js 18 oder höher
- MySQL 8.0 oder höher
- Maven 3.6 oder höher

### Backend-Konfiguration

1. **Repository klonen**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd hospitall
   ```

2. **Datenbank konfigurieren**
   ```bash
   # MySQL-Datenbank erstellen
   mysql -u root -p
   CREATE DATABASE hospitall;
   ```

3. **application.properties aktualisieren**
   ```properties
   # Datenbank-Konfiguration
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=ihr_benutzername
   spring.datasource.password=ihr_passwort
   
   # JPA-Konfiguration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   
   # JWT-Konfiguration
   jwt.secret=ihr_jwt_geheimer_schluessel
   jwt.expiration=86400000
   
   # E-Mail-Konfiguration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=ihre_email@gmail.com
   spring.mail.password=ihr_app_passwort
   ```

4. **Backend erstellen und ausführen**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend-Konfiguration

1. **Zum Frontend-Verzeichnis navigieren**
   ```bash
   cd frontend
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebung konfigurieren**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

4. **Entwicklungsserver starten**
   ```bash
   ng serve
   ```

## 🎯 Verwendung

### Zugriff auf die Anwendung

- **Frontend**: http://localhost:4200
- **Backend-API**: http://localhost:8080/api
- **API-Dokumentation**: http://localhost:8080/swagger-ui.html

### Standardkonten

#### Patientenkonto
- E-Mail: patient@example.com
- Passwort: password123

#### Arztkonto
- E-Mail: doctor@example.com
- Passwort: password123

### Wichtige Arbeitsabläufe

#### Patientenreise
1. Im Patientenportal registrieren/anmelden
2. Profilinformationen vervollständigen
3. Termine mit verfügbaren Ärzten buchen
4. Echtzeitbenachrichtigungen erhalten
5. Auf medizinische Aufzeichnungen und Verschreibungen zugreifen
6. PDF-Berichte herunterladen
7. Feedback geben

#### Arztreise
1. Im Arztportal anmelden
2. Zugewiesene Patienten anzeigen
3. Termine und Zeitpläne verwalten
4. Verschreibungen und Laboraufträge ausstellen
5. Patientenfeedback überprüfen
6. Medizinische Berichte erstellen

## 📚 API-Informationen

Die API-Dokumentation wird automatisch mit OpenAPI 3 generiert und ist verfügbar unter:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Haupt-API-Endpunkte

#### BALD VERFÜGBAR

## 🧪 Tests

### Backend-Tests
```bash
cd backend
mvn test
```

### Frontend-Tests
```bash
cd frontend
ng test
```

## 🤝 Mitwirkung

Wir begrüßen Beiträge zu HospitAll! Bitte befolgen Sie diese Schritte:

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/NeuesFunktion`)
3. Ihre Änderungen committen (`git commit -m 'Neue Funktion hinzufügen'`)
4. Branch pushen (`git push origin feature/NeuesFunktion`)
5. Pull Request öffnen

### Entwicklungsrichtlinien
- Spring Boot Best Practices für Backend-Entwicklung befolgen
- Angular Style Guide für Frontend-Entwicklung verwenden
- Umfassende Tests für neue Funktionen schreiben
- Dokumentation für API-Änderungen aktualisieren
- Sicherstellen, dass Code ordnungsgemäß formatiert und überprüft ist

## 🆘 Support

Für Support und Fragen:
- Issue im GitHub-Repository erstellen
- E-Mail: salahforquestions@gmail.com

## 🎉 Danksagungen

- Das Spring Boot-Team für das exzellente Framework
- Das Angular-Team für das robuste Frontend-Framework
- iText für die PDF-Generierungsfähigkeiten
- Alle Mitwirkenden, die geholfen haben, dieses Projekt zu ermöglichen

---

**HospitAll** - Kleine Gesundheitszentren mit moderner Technologie stärken 🏥✨
