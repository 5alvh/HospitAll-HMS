package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;

import com.tfg.back.model.User;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoUpdate;
import com.tfg.back.service.MedicalPrescriptionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(MEDICAL_PRESCRIPTION)
public class MedicalPrescriptionController {

    private final MedicalPrescriptionService medicalPrescriptionService;

    @Autowired
    public MedicalPrescriptionController(MedicalPrescriptionService medicalPrescriptionService) {
        this.medicalPrescriptionService = medicalPrescriptionService;
    }

    @PostMapping
    public ResponseEntity<Boolean> create(@RequestBody @Valid MedicalPrescriptionDtoCreate dto, @AuthenticationPrincipal User doctor) {
        Boolean prescription = medicalPrescriptionService.createPrescription(dto, doctor);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalPrescriptionDtoGet> getById(@PathVariable @Positive Long id, @AuthenticationPrincipal User user) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.findPrescriptionById(id, user);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<MedicalPrescriptionDtoGet>> getMyPrescriptions(@AuthenticationPrincipal User user,
                                                                              @RequestParam(value = "search", required = false) String search,
                                                                              @RequestParam(value = "page", defaultValue = "0") int page,
                                                                              @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<MedicalPrescriptionDtoGet> prescriptions = medicalPrescriptionService.findPrescriptionsByPatientId(user,search, PageRequest.of(page, size));
        return prescriptions.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/my")
    public ResponseEntity<Page<MedicalPrescriptionDtoGet>> getPrescriptionsByDoctor(@AuthenticationPrincipal User doctor,
                                                                   @RequestParam(value = "search", required = false) String search,
                                                                   @RequestParam(value = "page", defaultValue = "0") int page,
                                                                   @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<MedicalPrescriptionDtoGet> appointments = medicalPrescriptionService.findPrescriptionsByDoctorId(doctor,search, PageRequest.of(page, size));
        return appointments.isEmpty()? ResponseEntity.status(HttpStatus.NO_CONTENT).build() : ResponseEntity.ok(appointments);
    }

    @PutMapping("/update")
    public ResponseEntity<MedicalPrescriptionDtoGet> update(@RequestBody @Valid MedicalPrescriptionDtoUpdate dto, @AuthenticationPrincipal User doctor) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.updatePrescription(dto, doctor);
        return ResponseEntity.ok(prescription);
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<Boolean> publish(@PathVariable @Positive Long id, @AuthenticationPrincipal User doctor) {
        Boolean published = medicalPrescriptionService.publishPrescription(id, doctor);
        return ResponseEntity.ok(published);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id, @AuthenticationPrincipal User doctor) {
        medicalPrescriptionService.deletePrescription(id, doctor);
        return ResponseEntity.noContent().build();
    }


}
