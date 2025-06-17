package com.tfg.back.controller;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.model.dtos.appointment.BookAppointmentRequest;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentDtoGet>> getAllAppointments() {
        List<AppointmentDtoGet> appointments = appointmentService.getAllAppointments();
        if (appointments.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDtoGet> getAppointmentById(@PathVariable Long id) {
        AppointmentDtoGet appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/all-appointments")
    public ResponseEntity<List<AppointmentDtoGet>> getAllAppointmentsByAuthentication(Authentication authentication) {
        String email = authentication.getName();
        List<AppointmentDtoGet> appointments = appointmentService.getAppointmentsByClientEmail(email);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        String clientEmail = authentication.getName();
        appointmentService.cancelAppointment(id, clientEmail);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmAppointment(@PathVariable Long id, Authentication authentication) {
        String clientEmail = authentication.getName();
        appointmentService.confirmAppointment(id, clientEmail);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> completeAppointment(@PathVariable Long id, Authentication authentication) {
        String clientEmail = authentication.getName();
        appointmentService.completeAppointment(id, clientEmail);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/book-appointment")
    public ResponseEntity<AppointmentDtoGet> bookAppointment(@RequestBody BookAppointmentRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.bookAppointment(request.doctorId(), request.date(), request.startTime(), email ,request.type(),request.reason(), AppointmentStatus.SCHEDULED));
    }

    @PostMapping("/book-appointment-doctor/client-email")
    public ResponseEntity<AppointmentDtoGet> bookAppointmentByDoctorUsingClientEmail(@RequestBody BookAppointmentByDoctorRequest request, Authentication authentication) {
        String doctorEmail = authentication.getName();
        return ResponseEntity.ok(appointmentService.bookAppointmentByDoctorUsingClientEmail(request, doctorEmail));
    }

    @PostMapping("/book-appointment-doctor/client-id")
    public ResponseEntity<AppointmentDtoGet> bookAppointmentByDoctorUsingClientId(@RequestBody BookAppointmentByDoctorRequest request, Authentication authentication) {
        String doctorEmail = authentication.getName();
        return ResponseEntity.ok(appointmentService.bookAppointmentByDoctorUsingClientId(request, doctorEmail));
    }

    @PutMapping("/diagnosis")
    public ResponseEntity<AppointmentDtoGet> addDiagnosis(@RequestBody @Valid DiagnosisRequest request) {
        return ResponseEntity.ok(appointmentService.addDiagnosis(request));
    }

    @GetMapping("/total-patients/{id}")
    public ResponseEntity<Long> getTotalPatients(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getTotalPatientsThatVisitedDoctor(id));
    }

    /*
    @GetMapping("/available")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<LocalDateTime> slots = appointmentService.getAvailableSlots(doctorId, date);
        if (slots.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(slots);
    }
     */
}
