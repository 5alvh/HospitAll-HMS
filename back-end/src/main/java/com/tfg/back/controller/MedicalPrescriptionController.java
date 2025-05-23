package com.tfg.back.controller;

import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.service.MedicalPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medicalPrescription")
public class MedicalPrescriptionController {

    private final MedicalPrescriptionService medicalPrescriptionService;

    @Autowired
    public MedicalPrescriptionController(MedicalPrescriptionService medicalPrescriptionService) {
        this.medicalPrescriptionService = medicalPrescriptionService;
    }

    @PostMapping("/create")
    public ResponseEntity<MedicalPrescriptionDtoGet> createMedicalPrescription(@RequestBody  MedicalPrescriptionDtoCreate dto, Authentication authentication) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.createPrescription(dto, authentication.getName());
        return ResponseEntity.ok(prescription);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMedicalPrescription(@PathVariable Long id, Authentication authentication) {
        medicalPrescriptionService.deletePrescription(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<MedicalPrescriptionDtoGet> getMedicalPrescription(@PathVariable Long id, Authentication authentication) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.getPrescriptionById(id, authentication.getName());
        return ResponseEntity.ok(prescription);
    }
}
