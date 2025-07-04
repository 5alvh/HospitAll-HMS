# HospitAll 🏥

Un sistema de gestión hospitalaria (SGH) completo diseñado para pequeños centros de salud, que ofrece una gestión eficiente de la atención al paciente y operaciones de salud optimizadas.

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Información de la API](#información-de-la-api)
- [Contribución](#contribución)

## 🎯 Descripción general

HospitAll es un sistema de gestión hospitalaria moderno basado en web, adaptado para pequeños centros de salud. Proporciona una solución integral para la gestión de historiales de pacientes, citas, recetas médicas, resultados de laboratorio y flujos de trabajo de proveedores de atención médica. El sistema asegura una comunicación eficiente entre pacientes y proveedores de atención médica mientras mantiene registros médicos completos.

## ✨ Características

### 👨‍⚕️ Para Pacientes

#### Gestión de cuenta
- **Registro de usuario**: Crear nuevas cuentas de pacientes con autenticación segura
- **Sistema de inicio de sesión**: Acceso seguro al portal del paciente
- **Gestión de perfil**: Actualizar información personal y detalles médicos

#### Notificaciones
- **Notificaciones en tiempo real**: Recibir actualizaciones instantáneas vía WebSocket
- **Gestión de notificaciones**: Marcar notificaciones como leídas/no leídas
- **Historial de notificaciones**: Ver el historial completo de notificaciones

#### Citas
- **Reservar citas**: Programar citas con médicos disponibles
- **Cancelar citas**: Cancelar citas programadas si es necesario
- **Próximas citas**: Ver citas programadas con paginación y filtros
- **Historial de citas**: Acceder al historial completo de citas con funcionalidad de búsqueda
- **Detalles de la cita**: Ver información completa de la cita
- **Exportar PDF**: Descargar detalles de la cita en formato PDF

#### Recetas médicas
- **Recibir recetas**: Obtener recetas digitales de los médicos
- **Gestión de recetas**: Ver todas las recetas con paginación y filtros
- **Detalles de recetas**: Acceder a información detallada de las recetas
- **Exportar PDF**: Descargar recetas en formato PDF

#### Resultados de laboratorio
- **Recibir resultados**: Obtener resultados de laboratorio digitalmente
- **Gestión de resultados**: Ver todos los resultados de laboratorio con paginación y filtros
- **Exportar PDF**: Descargar resultados de laboratorio en formato PDF

#### Sistema de retroalimentación
- **Retroalimentación general**: Dar retroalimentación sobre el centro de salud
- **Retroalimentación específica del médico**: Evaluar y reseñar médicos específicos
- **Gestión de retroalimentación**: Ver, actualizar y eliminar sus comentarios

### 👩‍⚕️ Para Médicos

#### Gestión de cuenta
- **Registro de médico**: Crear cuentas de proveedores de atención médica
- **Sistema de inicio de sesión**: Acceso seguro al portal del médico
- **Gestión de perfil**: Gestionar información profesional

#### Gestión de pacientes
- **Directorio de pacientes**: Ver todos los pacientes con filtros avanzados y paginación
- **Historial de pacientes**: Acceder al historial médico completo de los pacientes
- **Registros médicos**: Ver citas, resultados de laboratorio y recetas
- **Atención al paciente**: Programar citas, ordenar pruebas de laboratorio y recetar medicamentos
- **Gestión de registros**: Actualizar y eliminar registros médicos

#### Gestión de recetas
- **Crear recetas**: Emitir recetas digitales a los pacientes
- **Historial de recetas**: Ver todas las recetas emitidas con filtros y paginación

#### Gestión de citas
- **Resumen de citas**: Ver todas las citas con filtros y paginación
- **Gestión de horarios**: Gestionar horarios de citas de manera eficiente

#### Análisis de retroalimentación
- **Revisión de retroalimentación**: Ver comentarios de pacientes con calificaciones
- **Análisis de rendimiento**: Seguir calificaciones promedio y satisfacción del paciente

## 🛠 Stack tecnológico

### Backend
- **Framework**: Spring Boot 3.4.5
- **Versión de Java**: 21
- **Seguridad**: Spring Security con autenticación JWT
- **Base de datos**: MySQL con Spring Data JPA
- **Comunicación en tiempo real**: WebSocket (Spring WebSocket)
- **Servicio de correo electrónico**: Spring Mail
- **Generación de PDF**: iText PDF
- **Documentación de API**: OpenAPI 3 (Swagger)

#### Dependencias del Backend
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
- **Estilos**: Tailwind CSS 4.0.17
- **Iconos**: Font Awesome 6.7.2
- **Comunicación en tiempo real**: STOMP.js con SockJS
- **Notificaciones**: ngx-sonner
- **Alertas**: SweetAlert2
- **Renderizado del lado del servidor**: Angular SSR

#### Dependencias del Frontend
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

## 🏗 Arquitectura

```
HospitAll/
├── backend/                    # Aplicación Spring Boot
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
├── frontend/                   # Aplicación Angular
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

## 🚀 Instalación

### Prerrequisitos
- Java 21 o superior
- Node.js 18 o superior
- MySQL 8.0 o superior
- Maven 3.6 o superior

### Configuración del Backend

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/5alvh/HospitAll.git
   cd hospitall
   ```

2. **Configurar la base de datos**
   ```bash
   # Crear la base de datos MySQL
   mysql -u root -p
   CREATE DATABASE hospitall;
   ```

3. **Actualizar application.properties**
   ```properties
   # Configuración de la base de datos
   spring.datasource.url=jdbc:mysql://localhost:3306/hospitall
   spring.datasource.username=tu_nombre_usuario
   spring.datasource.password=tu_contraseña
   
   # Configuración JPA
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   
   # Configuración JWT
   jwt.secret=tu_clave_secreta_jwt
   jwt.expiration=86400000
   
   # Configuración de correo electrónico
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=tu_email@gmail.com
   spring.mail.password=tu_contraseña_app
   ```

4. **Construir y ejecutar el backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Configuración del Frontend

1. **Navegar al directorio del frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el entorno**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```

## 🎯 Uso

### Acceder a la aplicación

- **Frontend**: http://localhost:4200
- **API Backend**: http://localhost:8080/api
- **Documentación de la API**: http://localhost:8080/swagger-ui.html

### Cuentas por defecto

#### Cuenta de Paciente
- Email: patient@example.com
- Contraseña: password123

#### Cuenta de Médico
- Email: doctor@example.com
- Contraseña: password123

### Flujos de trabajo clave

#### Recorrido del Paciente
1. Registrarse/Iniciar sesión en el portal del paciente
2. Completar información del perfil
3. Reservar citas con médicos disponibles
4. Recibir notificaciones en tiempo real
5. Acceder a registros médicos y recetas
6. Descargar informes en PDF
7. Proporcionar retroalimentación

#### Recorrido del Médico
1. Iniciar sesión en el portal del médico
2. Ver pacientes asignados
3. Gestionar citas y horarios
4. Emitir recetas y órdenes de laboratorio
5. Revisar retroalimentación de pacientes
6. Generar informes médicos

## 📚 Información de la API

La documentación de la API se genera automáticamente con OpenAPI 3 y se puede ver en:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Endpoints principales de la API

#### ESTARÁ DISPONIBLE PRONTO

## 🧪 Pruebas

### Pruebas del Backend
```bash
cd backend
mvn test
```

### Pruebas del Frontend
```bash
cd frontend
ng test
```

## 🤝 Contribución

¡Damos la bienvenida a las contribuciones a HospitAll! Por favor, sigue estos pasos:

1. Hacer fork del repositorio
2. Crear una rama de característica (`git checkout -b feature/NuevaCaracteristica`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Hacer push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrir un Pull Request

### Pautas de desarrollo
- Seguir las mejores prácticas de Spring Boot para el desarrollo del backend
- Usar la guía de estilo de Angular para el desarrollo del frontend
- Escribir pruebas completas para nuevas características
- Actualizar documentación para cambios en la API
- Asegurar que el código esté correctamente formateado y verificado

## 🆘 Soporte

Para soporte y preguntas:
- Crear un issue en el repositorio de GitHub
- Email: salahforquestions@gmail.com

## 🎉 Agradecimientos

- El equipo de Spring Boot por el excelente framework
- El equipo de Angular por el framework frontend robusto
- iText por las capacidades de generación de PDF
- Todos los contribuyentes que han ayudado a hacer posible este proyecto

---

**HospitAll** - Empoderando pequeños centros de salud con tecnología moderna 🏥✨
