package com.tfg.back.controller;

import com.tfg.back.model.TimeInterval;
import com.tfg.back.model.dtos.EmailRequest;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.doctor.*;
import com.tfg.back.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/register")
    public ResponseEntity<DoctorDtoGet> createDoctor(@Valid @RequestBody DoctorDtoCreate doctor) {
        return ResponseEntity.ok(doctorService.createDoctor(doctor));
    }

    @GetMapping("/profile")
    public ResponseEntity<DoctorDtoGet> getDoctor(Authentication authentication) {
        String email = authentication.getName();
        System.out.println(email);
        return ResponseEntity.ok(doctorService.getDoctorByEmail(email));
    }
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDtoGet> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctor(id));
    }

    @GetMapping("/email")
    public ResponseEntity<DoctorDtoGet> getDoctorByEmail(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        return ResponseEntity.ok(doctorService.getDoctorByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<DoctorDtoGet>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/available-doctors")
    public ResponseEntity<List<AvailableDoctorGet>> getAvailableDoctors(@RequestBody AvailableDoctorsRequest request) {
        return ResponseEntity.ok(doctorService.getAvailableDoctors(request.departmentId(), request.date()));
    }

    @PostMapping("/available-slots")
    public ResponseEntity<List<TimeInterval>> getAvailableSlotsByDoctorIdAndDate(@RequestBody AvailableSlotsRequest request){
        return ResponseEntity.ok(doctorService.getAvailableSlots(request.doctorId(), request.date()));
    }

    @GetMapping("/get-doctors/{id}")
    public ResponseEntity<List<VisitedDoctorGet>> getDoctors(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorsClientVisited(id));
    }


}
