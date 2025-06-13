# HospitAll 🏥

A comprehensive hospital management system built with modern web technologies, designed to streamline healthcare operations and improve patient care.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/5alvh/HospitAll)
[![Java](https://img.shields.io/badge/Java-Spring_Boot-green)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange)](https://www.mysql.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

HospitAll is a full-stack hospital management system that digitizes and automates healthcare processes. It provides separate interfaces for patients (clients) and healthcare providers (doctors) while maintaining secure data management and efficient workflow automation.

### Key Objectives
- **Patient-Centered Care**: Streamlined appointment booking and medical record access
- **Provider Efficiency**: Comprehensive tools for doctors to manage patients and prescriptions
- **Data Security**: Robust authentication and authorization mechanisms
- **Process Automation**: Automated notifications, PDF generation, and workflow management

## ✨ Features

### 👥 User Management
- **Multi-Role Authentication**: Separate login systems for clients and doctors
- **Account Management**: Registration, profile updates, password changes
- **Account Status Control**: Activation, suspension, and deactivation capabilities
- **Secure Password Recovery**: Token-based password reset system

### 📅 Appointment System
- **Smart Booking**: Real-time availability checking and slot reservation
- **Multiple Booking Methods**: Client self-booking and doctor-initiated appointments
- **Status Management**: Complete appointment lifecycle (scheduled → confirmed → completed/cancelled)
- **Availability Management**: Dynamic doctor schedule and time slot management

### 💊 Medical Management
- **Digital Prescriptions**: Create, update, and publish medical prescriptions
- **Lab Results**: Secure lab result management and sharing
- **Medical Records**: Comprehensive patient history and diagnosis tracking
- **PDF Generation**: Professional PDF documents for prescriptions and appointment summaries

### 🏥 Hospital Operations
- **Department Management**: Organize doctors by medical departments
- **Doctor Specializations**: Track and manage medical specialties
- **Patient Feedback**: Feedback collection and management system
- **Notification System**: Real-time notifications for appointments and updates

### 📊 Advanced Features
- **Real-time Notifications**: Push notifications for important updates
- **Document Management**: Secure handling of medical documents
- **Analytics Dashboard**: Patient statistics and appointment metrics
- **Multi-level Membership**: Different client membership tiers

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL with JPA/Hibernate
- **Documentation**: Swagger/OpenAPI 3
- **PDF Generation**: iText7 library
- **Validation**: Jakarta Bean Validation

### Frontend
- **Framework**: Angular (Latest version)
- **UI Components**: Modern responsive design
- **HTTP Client**: Angular HttpClient for API communication
- **Routing**: Angular Router for navigation
- **State Management**: Angular services and RxJS

### Database
- **Primary Database**: MySQL
- **ORM**: Hibernate/JPA
- **Connection Pooling**: HikariCP
- **Migrations**: Flyway/Liquibase (recommended)

### DevOps & Tools
- **Build Tool**: Maven
- **Version Control**: Git
- **API Testing**: Postman/Swagger UI
- **IDE**: IntelliJ IDEA/VS Code

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular UI    │    │  Spring Boot    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Client Portal │    │ • REST APIs     │    │ • User Data     │
│ • Doctor Portal │    │ • Security      │    │ • Appointments  │
│ • Admin Panel   │    │ • Business      │    │ • Medical       │
│                 │    │   Logic         │    │   Records       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

#### Controllers Layer
- `AuthController`: Authentication and login management
- `ClientController`: Patient/client operations
- `DoctorController`: Doctor-specific functionalities
- `AppointmentController`: Appointment lifecycle management
- `MedicalPrescriptionController`: Prescription management
- `PdfController`: Document generation services

#### Security Layer
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt
- Account status validation (active/suspended/locked)

#### Service Layer
- Business logic implementation
- Data validation and processing
- Email notifications
- PDF document generation

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: Version 16+ with npm
- **MySQL**: Version 8.0+
- **Maven**: Version 3.6+
- **Git**: Latest version

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd HospitAll
   ```

2. **Configure MySQL Database**
   ```sql
   CREATE DATABASE hospitall;
   CREATE USER 'hospitall_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON hospitall.* TO 'hospitall_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update Application Properties**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=hospitall_user
   spring.datasource.password=your_password
   
   # JWT Configuration
   jwt.secret=your-secret-key
   jwt.expiration=86400000
   
   # Email Configuration (for password reset)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

4. **Run the Backend**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend  # Adjust path as needed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoints**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/forgot-password` | Initiate password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Client Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/clients/register` | Register new client |
| GET | `/clients/profile` | Get current client profile |
| PUT | `/clients/{id}` | Update client information |
| GET | `/clients/appointments` | Get client appointments |
| PUT | `/clients/change-password` | Change password |

### Doctor Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/doctors/register` | Register new doctor |
| GET | `/doctors/profile` | Get current doctor profile |
| GET | `/doctors/all` | Get all doctors |
| POST | `/doctors/available-doctors` | Get available doctors |
| POST | `/doctors/available-slots` | Get available time slots |

### Appointment Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointment/book-appointment` | Book new appointment |
| GET | `/appointment/{id}` | Get appointment details |
| PUT | `/appointment/{id}/cancel` | Cancel appointment |
| PUT | `/appointment/{id}/confirm` | Confirm appointment |
| PUT | `/appointment/{id}/complete` | Mark appointment as completed |

### Medical Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/medical-prescriptions/create` | Create prescription |
| GET | `/medical-prescriptions/get/{id}` | Get prescription |
| PATCH | `/medical-prescriptions/publish/{id}` | Publish prescription |
| POST | `/lab-results/create` | Create lab result |
| GET | `/pdf/appointment/{id}` | Generate appointment PDF |
| GET | `/pdf/medication-prescription/{id}` | Generate prescription PDF |

## 🗄 Database Schema

### Core Entities

#### Users
- **Client**: Patient information, membership levels, contact details
- **Doctor**: Medical professionals, specializations, departments, license numbers
- **Admin**: System administrators (if applicable)

#### Medical Records
- **Appointment**: Booking details, status, diagnosis, type
- **MedicalPrescription**: Medication details, dosage, duration
- **LabResult**: Laboratory test results and reports
- **Department**: Medical departments and specialties

#### System Entities
- **Notification**: User notifications and alerts
- **Feedback**: Patient feedback and ratings
- **TimeInterval**: Available appointment slots

### Relationships
- Client ↔ Appointment (One-to-Many)
- Doctor ↔ Appointment (One-to-Many)
- Doctor ↔ Department (Many-to-One)
- Client ↔ MedicalPrescription (One-to-Many)
- Doctor ↔ MedicalPrescription (One-to-Many)

## 🔐 Security

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Role-Based Access**: Separate permissions for clients and doctors
- **Password Security**: BCrypt hashing with salt
- **Account Management**: Status-based access control (active/suspended/locked)

### API Security
- **CORS Configuration**: Controlled cross-origin requests
- **Request Validation**: Input sanitization and validation
- **Error Handling**: Secure error messages without sensitive data exposure
- **Rate Limiting**: Protection against abuse (recommended implementation)

### Data Protection
- **Sensitive Data Encryption**: Medical records and personal information
- **Audit Logging**: Track access to sensitive medical data
- **Secure File Handling**: PDF generation and document storage
- **Database Security**: Encrypted connections and parameterized queries

## 🤝 Contributing

We welcome contributions to HospitAll! Please follow these guidelines:

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions
- Use proper REST API design principles
- Implement comprehensive error handling
- Add unit tests for new features
- Update documentation for API changes

### Bug Reports
When reporting bugs, please include:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- System environment details
- Error logs (if applicable)

## 🙋‍♂️ Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/5alvh/HospitAll/issues)
- **Documentation**: Check the API documentation at `/swagger-ui.html`
- **Email**: Contact the development team

## 🎉 Acknowledgments

- Spring Boot community for excellent documentation
- Angular team for the robust frontend framework
- iText7 for PDF generation capabilities
- MySQL for reliable data storage
- All contributors who helped build this system

---

**HospitAll** - Revolutionizing hospital management through technology 🏥✨
