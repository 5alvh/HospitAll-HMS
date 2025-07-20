package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.model.dtos.appointment.BookAppointmentRequest;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(APPOINTMENT)
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentDtoGet> create(@RequestBody @Valid BookAppointmentRequest request, @AuthenticationPrincipal User patient) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request, patient));
    }

    @PostMapping("/doctor/id")
    public ResponseEntity<AppointmentDtoGet> bookAppointmentWithClientId(@RequestBody BookAppointmentByDoctorRequest request, @AuthenticationPrincipal User doctor) {
        return ResponseEntity.ok(appointmentService.bookByDoctorWithClientId(request, doctor));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDtoGet>> getAllAppointments() {
        List<AppointmentDtoGet> appointments = appointmentService.findAllAppointments();
        if (appointments.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(appointments);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDtoGet> getById(@PathVariable @Positive Long id) {
        AppointmentDtoGet appointment = appointmentService.findAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/patient/my")
    public ResponseEntity<List<AppointmentDtoGet>> getMyBookedAppointments(@AuthenticationPrincipal User patient) {
        List<AppointmentDtoGet> appointments = appointmentService.findAppointmentsByClientId(patient);
        return appointments.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient/my/upComing")
    public ResponseEntity<Page<AppointmentDtoGet>> getMyUpcomingAppointments(@AuthenticationPrincipal User patient,
                                                                             @RequestParam(defaultValue = "0") int page,
                                                                             @RequestParam(defaultValue = "10") int size,
                                                                             @RequestParam(defaultValue = "false") boolean includeCancelled) {
        Page<AppointmentDtoGet> appointments = appointmentService.findUpcomingAppointmentsByClientId(patient, PageRequest.of(page,size, Sort.by("appointmentDateTime").descending()), includeCancelled);
        return appointments.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient/my/history")
    public ResponseEntity<Page<AppointmentDtoGet>> getMyAppointmentsHistory(@AuthenticationPrincipal User patient,
                                                                            @RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int size) {
        Page<AppointmentDtoGet> appointments = appointmentService.findAppointmentsHistoryByClientId(patient, PageRequest.of(page,size, Sort.by("appointmentDateTime").descending()));
        return appointments.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/my")
    public ResponseEntity<List<AppointmentDtoGet>> getMyAppointments(@AuthenticationPrincipal User doctor) {
        List<AppointmentDtoGet> appointments = appointmentService.findAppointmentsByDoctorId(doctor);
        return appointments.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/my/pageable")
    public ResponseEntity<Page<AppointmentDtoGet>> getMyAppointments(@AuthenticationPrincipal User doctor,
                                                                     @RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestParam(required = false) List<AppointmentStatus> filter,
                                                                     @RequestParam(required = false) boolean includeCancelled,
                                                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime before,
                                                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime after) {

        Collection<AppointmentStatus> statusesToUse = (filter == null || filter.isEmpty())
                ? List.of(AppointmentStatus.values())
                : filter;

        statusesToUse = (includeCancelled || statusesToUse.contains(AppointmentStatus.CANCELLED) && statusesToUse.size() == 1)? statusesToUse : statusesToUse.stream().filter(s -> s != AppointmentStatus.CANCELLED).toList();

        Page<AppointmentDtoGet> appointments = appointmentService
                .findAppointmentsByDoctorIdPageable(doctor,
                        statusesToUse,
                        before,
                        after,
                        PageRequest.of(page,size,Sort.by("appointmentDateTime").descending()));
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/patients/count")
    public ResponseEntity<Long> getDoctorPatientCount(@AuthenticationPrincipal  User doctor) {
        Long count = appointmentService.countPatientsForDoctor(doctor);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable @Positive  Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Void> confirm(@PathVariable @Positive Long id) {
        appointmentService.confirmAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable @Positive Long id) {
        appointmentService.completeAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/diagnosis")
    public ResponseEntity<AppointmentDtoGet> createDiagnosis(@RequestBody @Valid DiagnosisRequest request) {
        return ResponseEntity.ok(appointmentService.addDiagnosis(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
