# HospitAll 🏥

Ein umfassendes Krankenhaus-Managementsystem, das mit modernen Web-Technologien entwickelt wurde, um Gesundheitsoperationen zu optimieren und die Patientenversorgung zu verbessern.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/5alvh/HospitAll)
[![Java](https://img.shields.io/badge/Java-Spring_Boot-green)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Datenbank-orange)](https://www.mysql.com/)

## 📋 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Funktionen](#funktionen)
- [Technologie-Stack](#technologie-stack)
- [Systemarchitektur](#systemarchitektur)
- [Erste Schritte](#erste-schritte)
- [API-Dokumentation](#api-dokumentation)
- [Datenbankschema](#datenbankschema)
- [Sicherheit](#sicherheit)
- [Mitwirken](#mitwirken)
- [Lizenz](#lizenz)

## 🎯 Überblick

HospitAll ist ein Full-Stack-Krankenhaus-Managementsystem, das Gesundheitsprozesse digitalisiert und automatisiert. Es bietet separate Schnittstellen für Patienten (Klienten) und Gesundheitsdienstleister (Ärzte) und gewährleistet dabei sichere Datenverwaltung und effiziente Workflow-Automatisierung.

### Hauptziele
- **Patientenzentrierte Versorgung**: Optimierte Terminbuchung und Zugang zu Krankenakten
- **Anbieter-Effizienz**: Umfassende Tools für Ärzte zur Verwaltung von Patienten und Verschreibungen
- **Datensicherheit**: Robuste Authentifizierungs- und Autorisierungsmechanismen
- **Prozessautomatisierung**: Automatisierte Benachrichtigungen, PDF-Generierung und Workflow-Management

## ✨ Funktionen

### 👥 Benutzerverwaltung
- **Multi-Rollen-Authentifizierung**: Separate Anmeldesysteme für Klienten und Ärzte
- **Kontoverwaltung**: Registrierung, Profilaktualisierungen, Passwort-Änderungen
- **Kontostatus-Kontrolle**: Aktivierungs-, Suspendierungs- und Deaktivierungsfunktionen
- **Sichere Passwort-Wiederherstellung**: Token-basiertes Passwort-Reset-System

### 📅 Terminsystem
- **Intelligente Buchung**: Echtzeitprüfung der Verfügbarkeit und Slot-Reservierung
- **Mehrfache Buchungsmethoden**: Klienten-Selbstbuchung und arztinitiierte Termine
- **Status-Management**: Vollständiger Terminlebenszyklus (geplant → bestätigt → abgeschlossen/storniert)
- **Verfügbarkeitsverwaltung**: Dynamische Arztpläne und Zeitslot-Management

### 💊 Medizinische Verwaltung
- **Digitale Verschreibungen**: Erstellen, aktualisieren und veröffentlichen medizinischer Verschreibungen
- **Laborergebnisse**: Sichere Verwaltung und Weitergabe von Laborergebnissen
- **Krankenakten**: Umfassende Patientenhistorie und Diagnose-Verfolgung
- **PDF-Generierung**: Professionelle PDF-Dokumente für Verschreibungen und Terminzusammenfassungen

### 🏥 Krankenhausoperationen
- **Abteilungsverwaltung**: Organisation von Ärzten nach medizinischen Abteilungen
- **Arztspezialisierungen**: Verfolgung und Verwaltung medizinischer Spezialisierungen
- **Patientenfeedback**: Feedback-Sammlung und Verwaltungssystem
- **Benachrichtigungssystem**: Echtzeitbenachrichtigungen für Termine und Updates

### 📊 Erweiterte Funktionen
- **Echtzeitbenachrichtigungen**: Push-Benachrichtigungen für wichtige Updates
- **Dokumentenverwaltung**: Sichere Handhabung medizinischer Dokumente
- **Analytics-Dashboard**: Patientenstatistiken und Terminmetriken
- **Mehrstufige Mitgliedschaft**: Verschiedene Klienten-Mitgliedschaftsstufen

## 🛠 Technologie-Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Sicherheit**: Spring Security mit JWT-Authentifizierung
- **Datenbank**: MySQL mit JPA/Hibernate
- **Dokumentation**: Swagger/OpenAPI 3
- **PDF-Generierung**: iText7-Bibliothek
- **Validierung**: Jakarta Bean Validation

### Frontend
- **Framework**: Angular (Neueste Version)
- **UI-Komponenten**: Modernes responsives Design
- **HTTP-Client**: Angular HttpClient für API-Kommunikation
- **Routing**: Angular Router für Navigation
- **State Management**: Angular Services und RxJS

### Datenbank
- **Hauptdatenbank**: MySQL
- **ORM**: Hibernate/JPA
- **Connection Pooling**: HikariCP
- **Migrationen**: Flyway/Liquibase (empfohlen)

### DevOps & Tools
- **Build-Tool**: Maven
- **Versionskontrolle**: Git
- **API-Testing**: Postman/Swagger UI
- **IDE**: IntelliJ IDEA/VS Code

## 🏗 Systemarchitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular UI    │    │  Spring Boot    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Datenbank)   │
│                 │    │                 │    │                 │
│ • Klienten-     │    │ • REST APIs     │    │ • Benutzerdaten │
│   Portal        │    │ • Sicherheit    │    │ • Termine       │
│ • Arzt-Portal   │    │ • Geschäfts-    │    │ • Medizinische  │
│ • Admin-Panel   │    │   logik         │    │   Aufzeichnungen│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Hauptkomponenten

#### Controller-Schicht
- `AuthController`: Authentifizierung und Login-Management
- `ClientController`: Patienten-/Klienten-Operationen
- `DoctorController`: Arztspezifische Funktionalitäten
- `AppointmentController`: Terminlebenszyklus-Management
- `MedicalPrescriptionController`: Verschreibungsmanagement
- `PdfController`: Dokumentengenerierungsservices

#### Sicherheitsschicht
- JWT-basierte Authentifizierung
- Rollenbasierte Zugriffskontrolle (RBAC)
- Passwort-Verschlüsselung mit BCrypt
- Kontostatus-Validierung (aktiv/suspendiert/gesperrt)

#### Service-Schicht
- Geschäftslogik-Implementierung
- Datenvalidierung und -verarbeitung
- E-Mail-Benachrichtigungen
- PDF-Dokumentengenerierung

## 🚀 Erste Schritte

### Voraussetzungen

- **Java**: JDK 17 oder höher
- **Node.js**: Version 16+ mit npm
- **MySQL**: Version 8.0+
- **Maven**: Version 3.6+
- **Git**: Neueste Version

### Backend-Setup

1. **Repository klonen**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd HospitAll
   ```

2. **MySQL-Datenbank konfigurieren**
   ```sql
   CREATE DATABASE hospitall;
   CREATE USER 'hospitall_user'@'localhost' IDENTIFIED BY 'ihr_passwort';
   GRANT ALL PRIVILEGES ON hospitall.* TO 'hospitall_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Anwendungseigenschaften aktualisieren**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=hospitall_user
   spring.datasource.password=ihr_passwort
   
   # JWT-Konfiguration
   jwt.secret=ihr-geheimer-schluessel
   jwt.expiration=86400000
   
   # E-Mail-Konfiguration (für Passwort-Reset)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=ihre-email@gmail.com
   spring.mail.password=ihr-app-passwort
   ```

4. **Backend ausführen**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend-Setup

1. **Zum Frontend-Verzeichnis navigieren**
   ```bash
   cd frontend  # Pfad nach Bedarf anpassen
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **API-Endpunkte konfigurieren**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

4. **Entwicklungsserver starten**
   ```bash
   ng serve
   ```

### Auf die Anwendung zugreifen

- **Frontend**: http://localhost:4200
- **Backend-API**: http://localhost:8080
- **API-Dokumentation**: http://localhost:8080/swagger-ui.html

## 📚 API-Dokumentation

### Authentifizierungs-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/auth/login` | Benutzeranmeldung |
| POST | `/auth/forgot-password` | Passwort-Reset initiieren |
| POST | `/auth/reset-password` | Passwort mit Token zurücksetzen |

### Klientenverwaltung

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/clients/register` | Neuen Klienten registrieren |
| GET | `/clients/profile` | Aktuelles Klientenprofil abrufen |
| PUT | `/clients/{id}` | Klienteninformationen aktualisieren |
| GET | `/clients/appointments` | Kliententermine abrufen |
| PUT | `/clients/change-password` | Passwort ändern |

### Arztverwaltung

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/doctors/register` | Neuen Arzt registrieren |
| GET | `/doctors/profile` | Aktuelles Arztprofil abrufen |
| GET | `/doctors/all` | Alle Ärzte abrufen |
| POST | `/doctors/available-doctors` | Verfügbare Ärzte abrufen |
| POST | `/doctors/available-slots` | Verfügbare Zeitslots abrufen |

### Terminverwaltung

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/appointment/book-appointment` | Neuen Termin buchen |
| GET | `/appointment/{id}` | Termindetails abrufen |
| PUT | `/appointment/{id}/cancel` | Termin stornieren |
| PUT | `/appointment/{id}/confirm` | Termin bestätigen |
| PUT | `/appointment/{id}/complete` | Termin als abgeschlossen markieren |

### Medizinische Services

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/medical-prescriptions/create` | Verschreibung erstellen |
| GET | `/medical-prescriptions/get/{id}` | Verschreibung abrufen |
| PATCH | `/medical-prescriptions/publish/{id}` | Verschreibung veröffentlichen |
| POST | `/lab-results/create` | Laborergebnis erstellen |
| GET | `/pdf/appointment/{id}` | Termin-PDF generieren |
| GET | `/pdf/medication-prescription/{id}` | Verschreibungs-PDF generieren |

## 🗄 Datenbankschema

### Hauptentitäten

#### Benutzer
- **Klient**: Patienteninformationen, Mitgliedschaftsstufen, Kontaktdaten
- **Arzt**: Medizinische Fachkräfte, Spezialisierungen, Abteilungen, Lizenznummern
- **Admin**: Systemadministratoren (falls zutreffend)

#### Medizinische Aufzeichnungen
- **Termin**: Buchungsdetails, Status, Diagnose, Typ
- **MedizinischeVerschreibung**: Medikamentendetails, Dosierung, Dauer
- **Laborergebnis**: Labortest-Ergebnisse und Berichte
- **Abteilung**: Medizinische Abteilungen und Spezialisierungen

#### System-Entitäten
- **Benachrichtigung**: Benutzerbenachrichtigungen und Alarme
- **Feedback**: Patientenfeedback und Bewertungen
- **Zeitintervall**: Verfügbare Terminslots

### Beziehungen
- Klient ↔ Termin (Eins-zu-Viele)
- Arzt ↔ Termin (Eins-zu-Viele)
- Arzt ↔ Abteilung (Viele-zu-Eins)
- Klient ↔ MedizinischeVerschreibung (Eins-zu-Viele)
- Arzt ↔ MedizinischeVerschreibung (Eins-zu-Viele)

## 🔐 Sicherheit

### Authentifizierung & Autorisierung
- **JWT-Token**: Sichere zustandslose Authentifizierung
- **Rollenbasierter Zugriff**: Separate Berechtigungen für Klienten und Ärzte
- **Passwort-Sicherheit**: BCrypt-Hashing mit Salt
- **Kontoverwaltung**: Statusbasierte Zugriffskontrolle (aktiv/suspendiert/gesperrt)

### API-Sicherheit
- **CORS-Konfiguration**: Kontrollierte Cross-Origin-Anfragen
- **Anfrage-Validierung**: Input-Bereinigung und -Validierung
- **Fehlerbehandlung**: Sichere Fehlermeldungen ohne Preisgabe sensibler Daten
- **Rate Limiting**: Schutz vor Missbrauch (empfohlene Implementierung)

### Datenschutz
- **Verschlüsselung sensibler Daten**: Krankenakten und persönliche Informationen
- **Audit-Protokollierung**: Verfolgung des Zugriffs auf sensible medizinische Daten
- **Sichere Dateibehandlung**: PDF-Generierung und Dokumentenspeicherung
- **Datenbanksicherheit**: Verschlüsselte Verbindungen und parametrisierte Abfragen

## 🤝 Mitwirken

Wir begrüßen Beiträge zu HospitAll! Bitte befolgen Sie diese Richtlinien:

### Entwicklungsprozess
1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/tolles-feature`)
3. Änderungen committen (`git commit -m 'Tolles Feature hinzufügen'`)
4. Zum Branch pushen (`git push origin feature/tolles-feature`)
5. Pull Request öffnen

### Coding-Standards
- Java-Namenskonventionen befolgen
- Ordnungsgemäße REST-API-Design-Prinzipien verwenden
- Umfassende Fehlerbehandlung implementieren
- Unit-Tests für neue Features hinzufügen
- Dokumentation für API-Änderungen aktualisieren

### Bug-Reports
Beim Melden von Bugs bitte folgendes einschließen:
- Detaillierte Beschreibung des Problems
- Schritte zur Reproduktion
- Erwartetes vs. tatsächliches Verhalten
- Systemumgebungsdetails
- Fehlerprotokolle (falls zutreffend)

## 🙋‍♂️ Support

Für Support und Fragen:

- **GitHub Issues**: [Issue erstellen](https://github.com/5alvh/HospitAll/issues)
- **Dokumentation**: API-Dokumentation unter `/swagger-ui.html` einsehen
- **E-Mail**: Entwicklungsteam kontaktieren

## 🎉 Danksagungen

- Spring Boot-Community für exzellente Dokumentation
- Angular-Team für das robuste Frontend-Framework
- iText7 für PDF-Generierungsfähigkeiten
- MySQL für zuverlässige Datenspeicherung
- Alle Mitwirkenden, die beim Aufbau dieses Systems geholfen haben

---

**HospitAll** - Revolutionierung des Krankenhausmanagements durch Technologie 🏥✨
