# HospitAll 🏥

Un sistema integral de gestión hospitalaria construido con tecnologías web modernas, diseñado para optimizar las operaciones sanitarias y mejorar la atención al paciente.

[![GitHub](https://img.shields.io/badge/GitHub-Repositorio-blue)](https://github.com/5alvh/HospitAll)
[![Java](https://img.shields.io/badge/Java-Spring_Boot-green)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Base_de_Datos-orange)](https://www.mysql.com/)

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Primeros Pasos](#primeros-pasos)
- [Documentación API](#documentación-api)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Seguridad](#seguridad)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## 🎯 Descripción General

HospitAll es un sistema de gestión hospitalaria full-stack que digitaliza y automatiza los procesos sanitarios. Proporciona interfaces separadas para pacientes (clientes) y proveedores de atención médica (médicos) mientras mantiene una gestión segura de datos y automatización eficiente del flujo de trabajo.

### Objetivos Clave
- **Atención Centrada en el Paciente**: Reserva simplificada de citas y acceso a historiales médicos
- **Eficiencia del Proveedor**: Herramientas integrales para que los médicos gestionen pacientes y recetas
- **Seguridad de Datos**: Mecanismos robustos de autenticación y autorización
- **Automatización de Procesos**: Notificaciones automatizadas, generación de PDF y gestión de flujos de trabajo

## ✨ Características

### 👥 Gestión de Usuarios
- **Autenticación Multi-Rol**: Sistemas de login separados para clientes y médicos
- **Gestión de Cuentas**: Registro, actualizaciones de perfil, cambios de contraseña
- **Control de Estado de Cuenta**: Capacidades de activación, suspensión y desactivación
- **Recuperación Segura de Contraseña**: Sistema de restablecimiento de contraseña basado en tokens

### 📅 Sistema de Citas
- **Reserva Inteligente**: Verificación en tiempo real de disponibilidad y reserva de horarios
- **Múltiples Métodos de Reserva**: Auto-reserva del cliente y citas iniciadas por el médico
- **Gestión de Estado**: Ciclo de vida completo de citas (programada → confirmada → completada/cancelada)
- **Gestión de Disponibilidad**: Horarios dinámicos de médicos y gestión de franjas horarias

### 💊 Gestión Médica
- **Recetas Digitales**: Crear, actualizar y publicar recetas médicas
- **Resultados de Laboratorio**: Gestión y compartición segura de resultados de laboratorio
- **Historiales Médicos**: Seguimiento integral del historial del paciente y diagnósticos
- **Generación de PDF**: Documentos PDF profesionales para recetas y resúmenes de citas

### 🏥 Operaciones Hospitalarias
- **Gestión de Departamentos**: Organizar médicos por departamentos médicos
- **Especializaciones de Médicos**: Seguimiento y gestión de especialidades médicas
- **Retroalimentación de Pacientes**: Sistema de recopilación y gestión de comentarios
- **Sistema de Notificaciones**: Notificaciones en tiempo real para citas y actualizaciones

### 📊 Características Avanzadas
- **Notificaciones en Tiempo Real**: Notificaciones push para actualizaciones importantes
- **Gestión de Documentos**: Manejo seguro de documentos médicos
- **Panel de Análisis**: Estadísticas de pacientes y métricas de citas
- **Membresía Multi-nivel**: Diferentes niveles de membresía para clientes

## 🛠 Stack Tecnológico

### Backend
- **Framework**: Spring Boot 3.x
- **Seguridad**: Spring Security con autenticación JWT
- **Base de Datos**: MySQL con JPA/Hibernate
- **Documentación**: Swagger/OpenAPI 3
- **Generación de PDF**: Librería iText7
- **Validación**: Jakarta Bean Validation

### Frontend
- **Framework**: Angular (Versión más reciente)
- **Componentes UI**: Diseño responsivo moderno
- **Cliente HTTP**: Angular HttpClient para comunicación API
- **Rutas**: Angular Router para navegación
- **Gestión de Estado**: Servicios Angular y RxJS

### Base de Datos
- **Base de Datos Principal**: MySQL
- **ORM**: Hibernate/JPA
- **Pool de Conexiones**: HikariCP
- **Migraciones**: Flyway/Liquibase (recomendado)

### DevOps y Herramientas
- **Herramienta de Construcción**: Maven
- **Control de Versiones**: Git
- **Pruebas de API**: Postman/Swagger UI
- **IDE**: IntelliJ IDEA/VS Code

## 🏗 Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular UI    │    │  Spring Boot    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│ (Base de Datos) │
│                 │    │                 │    │                 │
│ • Portal Cliente│    │ • APIs REST     │    │ • Datos Usuario │
│ • Portal Médico │    │ • Seguridad     │    │ • Citas         │
│ • Panel Admin   │    │ • Lógica de     │    │ • Historiales   │
│                 │    │   Negocio       │    │   Médicos       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes Clave

#### Capa de Controladores
- `AuthController`: Gestión de autenticación y login
- `ClientController`: Operaciones de pacientes/clientes
- `DoctorController`: Funcionalidades específicas de médicos
- `AppointmentController`: Gestión del ciclo de vida de citas
- `MedicalPrescriptionController`: Gestión de recetas
- `PdfController`: Servicios de generación de documentos

#### Capa de Seguridad
- Autenticación basada en JWT
- Control de acceso basado en roles (RBAC)
- Cifrado de contraseñas con BCrypt
- Validación de estado de cuenta (activa/suspendida/bloqueada)

#### Capa de Servicios
- Implementación de lógica de negocio
- Validación y procesamiento de datos
- Notificaciones por email
- Generación de documentos PDF

## 🚀 Primeros Pasos

### Requisitos Previos

- **Java**: JDK 17 o superior
- **Node.js**: Versión 16+ con npm
- **MySQL**: Versión 8.0+
- **Maven**: Versión 3.6+
- **Git**: Versión más reciente

### Configuración del Backend

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd HospitAll
   ```

2. **Configurar Base de Datos MySQL**
   ```sql
   CREATE DATABASE hospitall;
   CREATE USER 'hospitall_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT ALL PRIVILEGES ON hospitall.* TO 'hospitall_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Actualizar Propiedades de la Aplicación**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=hospitall_user
   spring.datasource.password=tu_contraseña
   
   # Configuración JWT
   jwt.secret=tu-clave-secreta
   jwt.expiration=86400000
   
   # Configuración de Email (para restablecimiento de contraseña)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=tu-email@gmail.com
   spring.mail.password=tu-contraseña-app
   ```

4. **Ejecutar el Backend**
   ```bash
   ./mvnw spring-boot:run
   ```

### Configuración del Frontend

1. **Navegar al directorio frontend**
   ```bash
   cd frontend  # Ajustar ruta según sea necesario
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar endpoints de API**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```

### Acceder a la Aplicación

- **Frontend**: http://localhost:4200
- **API Backend**: http://localhost:8080
- **Documentación API**: http://localhost:8080/swagger-ui.html

## 📚 Documentación API

### Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login de usuario |
| POST | `/auth/forgot-password` | Iniciar restablecimiento de contraseña |
| POST | `/auth/reset-password` | Restablecer contraseña con token |

### Gestión de Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/clients/register` | Registrar nuevo cliente |
| GET | `/clients/profile` | Obtener perfil del cliente actual |
| PUT | `/clients/{id}` | Actualizar información del cliente |
| GET | `/clients/appointments` | Obtener citas del cliente |
| PUT | `/clients/change-password` | Cambiar contraseña |

### Gestión de Médicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/doctors/register` | Registrar nuevo médico |
| GET | `/doctors/profile` | Obtener perfil del médico actual |
| GET | `/doctors/all` | Obtener todos los médicos |
| POST | `/doctors/available-doctors` | Obtener médicos disponibles |
| POST | `/doctors/available-slots` | Obtener horarios disponibles |

### Gestión de Citas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/appointment/book-appointment` | Reservar nueva cita |
| GET | `/appointment/{id}` | Obtener detalles de cita |
| PUT | `/appointment/{id}/cancel` | Cancelar cita |
| PUT | `/appointment/{id}/confirm` | Confirmar cita |
| PUT | `/appointment/{id}/complete` | Marcar cita como completada |

### Servicios Médicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/medical-prescriptions/create` | Crear receta |
| GET | `/medical-prescriptions/get/{id}` | Obtener receta |
| PATCH | `/medical-prescriptions/publish/{id}` | Publicar receta |
| POST | `/lab-results/create` | Crear resultado de laboratorio |
| GET | `/pdf/appointment/{id}` | Generar PDF de cita |
| GET | `/pdf/medication-prescription/{id}` | Generar PDF de receta |

## 🗄 Esquema de Base de Datos

### Entidades Principales

#### Usuarios
- **Cliente**: Información del paciente, niveles de membresía, detalles de contacto
- **Médico**: Profesionales médicos, especializaciones, departamentos, números de licencia
- **Admin**: Administradores del sistema (si aplica)

#### Registros Médicos
- **Cita**: Detalles de reserva, estado, diagnóstico, tipo
- **RecetaMédica**: Detalles de medicación, dosis, duración
- **ResultadoLaboratorio**: Resultados de pruebas de laboratorio e informes
- **Departamento**: Departamentos médicos y especialidades

#### Entidades del Sistema
- **Notificación**: Notificaciones y alertas de usuario
- **Retroalimentación**: Comentarios y calificaciones de pacientes
- **IntervaloTiempo**: Horarios de citas disponibles

### Relaciones
- Cliente ↔ Cita (Uno-a-Muchos)
- Médico ↔ Cita (Uno-a-Muchos)
- Médico ↔ Departamento (Muchos-a-Uno)
- Cliente ↔ RecetaMédica (Uno-a-Muchos)
- Médico ↔ RecetaMédica (Uno-a-Muchos)

## 🔐 Seguridad

### Autenticación y Autorización
- **Tokens JWT**: Autenticación segura sin estado
- **Acceso Basado en Roles**: Permisos separados para clientes y médicos
- **Seguridad de Contraseñas**: Hash BCrypt con sal
- **Gestión de Cuentas**: Control de acceso basado en estado (activa/suspendida/bloqueada)

### Seguridad de API
- **Configuración CORS**: Solicitudes de origen cruzado controladas
- **Validación de Solicitudes**: Sanitización y validación de entrada
- **Manejo de Errores**: Mensajes de error seguros sin exposición de datos sensibles
- **Limitación de Velocidad**: Protección contra abuso (implementación recomendada)

### Protección de Datos
- **Cifrado de Datos Sensibles**: Registros médicos e información personal
- **Registro de Auditoría**: Seguimiento de acceso a datos médicos sensibles
- **Manejo Seguro de Archivos**: Generación de PDF y almacenamiento de documentos
- **Seguridad de Base de Datos**: Conexiones cifradas y consultas parametrizadas

## 🤝 Contribuir

¡Damos la bienvenida a contribuciones a HospitAll! Por favor, sigue estas pautas:

### Proceso de Desarrollo
1. Hacer fork del repositorio
2. Crear una rama de característica (`git checkout -b feature/caracteristica-increible`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar característica increíble'`)
4. Hacer push a la rama (`git push origin feature/caracteristica-increible`)
5. Abrir un Pull Request

### Estándares de Codificación
- Seguir convenciones de nomenclatura de Java
- Usar principios apropiados de diseño de API REST
- Implementar manejo integral de errores
- Agregar pruebas unitarias para nuevas características
- Actualizar documentación para cambios de API

### Reportes de Errores
Al reportar errores, por favor incluye:
- Descripción detallada del problema
- Pasos para reproducir
- Comportamiento esperado vs real
- Detalles del entorno del sistema
- Logs de error (si aplica)

## 🙋‍♂️ Soporte

Para soporte y preguntas:

- **GitHub Issues**: [Crear un issue](https://github.com/5alvh/HospitAll/issues)
- **Documentación**: Revisar la documentación de API en `/swagger-ui.html`
- **Email**: Contactar al equipo de desarrollo

## 🎉 Reconocimientos

- Comunidad de Spring Boot por la excelente documentación
- Equipo de Angular por el framework frontend robusto
- iText7 por las capacidades de generación de PDF
- MySQL por el almacenamiento confiable de datos
- Todos los contribuyentes que ayudaron a construir este sistema

---

**HospitAll** - Revolucionando la gestión hospitalaria a través de la tecnología 🏥✨
