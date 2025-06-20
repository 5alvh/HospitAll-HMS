package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;

import com.tfg.back.model.TimeInterval;
import com.tfg.back.model.dtos.auth.AuthRequest;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;
import com.tfg.back.model.dtos.users.EmailRequest;
import com.tfg.back.model.dtos.doctor.*;
import com.tfg.back.service.DoctorService;
import com.tfg.back.service.serviceImpl.LoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(DOCTOR)
public class DoctorController {

    private final DoctorService doctorService;
    private final LoginService loginService;

    @Autowired
    public DoctorController(DoctorService doctorService, LoginService loginService) {
        this.doctorService = doctorService;
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(@Valid @RequestBody DoctorDtoCreate doctor) {
        DoctorDtoGet createdDoctor = doctorService.createDoctor(doctor);
        AuthRequest request = new AuthRequest(createdDoctor.getEmail().toString(), doctor.hashedPassword(), false);
        return loginService.login(request);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest newPassword) {
        String email = authentication.getName();
        doctorService.changePassword(email, newPassword);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDtoGet> updateClient(@PathVariable UUID id, @Valid @RequestBody DoctorDtoUpdate dto){
        DoctorDtoGet client = doctorService.updateDoctor(id, dto);
        return ResponseEntity.ok(client);
    }


    @GetMapping("/profile")
    public ResponseEntity<DoctorDtoGet> getDoctor(Authentication authentication) {
        String email = authentication.getName();
        DoctorDtoGet doctor = doctorService.getDoctorByEmail(email);
        return ResponseEntity.ok(doctor);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDtoGet> getDoctorById(@PathVariable UUID id) {
        DoctorDtoGet doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/email")
    public ResponseEntity<DoctorDtoGet> getDoctorByEmail(@RequestBody EmailRequest request) {
        String email = request.email();
        DoctorDtoGet doctor = doctorService.getDoctorByEmail(email);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DoctorDtoGet>> getAllDoctors() {
        List<DoctorDtoGet> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/available-doctors")
    public ResponseEntity<List<AvailableDoctorGet>> getAvailableDoctors(@RequestBody AvailableDoctorsRequest request) {
        List<AvailableDoctorGet> availableDoctors = doctorService.getAvailableDoctors(request.departmentId(), request.date());
        return ResponseEntity.ok(availableDoctors);
    }

    @PostMapping("/available-slots")
    public ResponseEntity<List<TimeInterval>> getAvailableSlotsByDoctorIdAndDate(@RequestBody AvailableSlotsRequest request){
        List<TimeInterval> timeIntervals = doctorService.getAvailableSlots(request.doctorId(), request.date());
        return ResponseEntity.ok(timeIntervals);
    }

    @GetMapping("/get-doctors/{id}")
    public ResponseEntity<List<VisitedDoctorGet>> getDoctorsClientVisited(@PathVariable Long id) {
        List<VisitedDoctorGet> doctors = doctorService.getDoctorsClientVisited(id);
        return ResponseEntity.ok(doctors);
    }
}
