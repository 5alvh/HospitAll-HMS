<img width="1000" height="300" alt="blue-background-with-tiny-bubbles" src="https://github.com/user-attachments/assets/c88b56a6-c2b0-429e-9f1f-e6139264df18" />

A comprehensive Hospital Management System (HMS) designed for small health centers, providing efficient patient care management and streamlined healthcare operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Informations](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

HospitAll is a modern web-based Hospital Management System tailored for small health centers. It provides a complete solution for managing patient records, appointments, medical prescriptions, lab results, and healthcare provider workflows. The system ensures efficient communication between patients and healthcare providers while maintaining comprehensive medical records.

## ✨ Features

### 👨‍⚕️ For Patients

#### Account Management
- **User Registration**: Create new patient accounts with secure authentication
- **Login System**: Secure access to patient portal
- **Profile Management**: Update personal information and medical details

#### Notifications
- **Real-time Notifications**: Receive instant updates via WebSocket
- **Notification Management**: Mark notifications as read/unread
- **Notification History**: View complete notification history

#### Appointments
- **Book Appointments**: Schedule appointments with available doctors
- **Cancel Appointments**: Cancel scheduled appointments when needed
- **Upcoming Appointments**: View scheduled appointments with pagination and filters
- **Appointment History**: Access complete appointment history with search functionality
- **Appointment Details**: View comprehensive appointment information
- **PDF Export**: Download appointment details as PDF documents

#### Medical Prescriptions
- **Receive Prescriptions**: Get digital prescriptions from doctors
- **Prescription Management**: View all prescriptions with pagination and filters
- **Prescription Details**: Access detailed prescription information
- **PDF Export**: Download prescriptions as PDF documents

#### Lab Results
- **Receive Results**: Get lab results digitally
- **Results Management**: View all lab results with pagination and filters
- **PDF Export**: Download lab results as PDF documents

#### Feedback System
- **General Feedback**: Provide feedback about the health center
- **Doctor-specific Feedback**: Rate and review specific doctors
- **Feedback Management**: View, update, and delete your feedback

### 👩‍⚕️ For Doctors

#### Account Management
- **Doctor Registration**: Create healthcare provider accounts
- **Login System**: Secure access to doctor portal
- **Profile Management**: Manage professional information

#### Patient Management
- **Patient Directory**: View all patients with advanced filters and pagination
- **Patient History**: Access complete patient medical history
- **Medical Records**: View appointments, lab results, and prescriptions
- **Patient Care**: Schedule appointments, order lab tests, and prescribe medications
- **Record Management**: Update and delete medical records

#### Prescription Management
- **Create Prescriptions**: Issue digital prescriptions to patients
- **Prescription History**: View all issued prescriptions with filters and pagination

#### Appointment Management
- **Appointment Overview**: View all appointments with filters and pagination
- **Schedule Management**: Manage appointment schedules efficiently

#### Feedback Analytics
- **Feedback Review**: View patient feedback with ratings
- **Performance Analytics**: Track average ratings and patient satisfaction

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.5
- **Java Version**: 21
- **Security**: Spring Security with JWT Authentication
- **Database**: MySQL with Spring Data JPA
- **Real-time Communication**: WebSocket (Spring WebSocket)
- **Email Service**: Spring Mail
- **PDF Generation**: iText PDF
- **API Documentation**: OpenAPI 3 (Swagger)

#### Backend Dependencies
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
- **Styling**: Tailwind CSS 4.0.17
- **Icons**: Font Awesome 6.7.2
- **Real-time Communication**: STOMP.js with SockJS
- **Notifications**: ngx-sonner
- **Alerts**: SweetAlert2
- **Server-Side Rendering**: Angular SSR

#### Frontend Dependencies
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
├── backend/                    # Spring Boot Application
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
├── frontend/                   # Angular Application
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

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hospitall.git](https://github.com/5alvh/HospitAll.git
   cd hospitall
   ```

2. **Configure Database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE hospitall;
   ```

3. **Update application.properties**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   # JPA Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   
   # JWT Configuration
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000
   
   # Email Configuration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   ```

4. **Build and run the backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

## 🎯 Usage

### Accessing the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/swagger-ui.html

### Default Accounts

#### Patient Account
- Email: patient@example.com
- Password: password123

#### Doctor Account
- Email: doctor@example.com
- Password: password123

### Key Workflows

#### Patient Journey
1. Register/Login to the patient portal
2. Complete profile information
3. Book appointments with available doctors
4. Receive real-time notifications
5. Access medical records and prescriptions
6. Download PDF reports
7. Provide feedback

#### Doctor Journey
1. Login to the doctor portal
2. View assigned patients
3. Manage appointments and schedules
4. Issue prescriptions and lab orders
5. Review patient feedback
6. Generate medical reports

## 📚 API Documentation

The API documentation is automatically generated using OpenAPI 3 and can be accessed at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key API Endpoints

#### WILL BE AVAILABLE SOON

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
ng test
```

## 🤝 Contributing

We welcome contributions to HospitAll! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow Spring Boot best practices for backend development
- Use Angular style guide for frontend development
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure code is properly formatted and linted


## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: salahforquestions@gmail.com

## 🎉 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the robust frontend framework
- iText for PDF generation capabilities
- All contributors who helped make this project possible

---

**HospitAll** - Empowering small health centers with modern technology 🏥✨
