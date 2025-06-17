package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoUpdate;
import com.tfg.back.service.MedicalPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(MEDICAL_PRESCRIPTION)
public class MedicalPrescriptionController {

    private final MedicalPrescriptionService medicalPrescriptionService;

    @Autowired
    public MedicalPrescriptionController(MedicalPrescriptionService medicalPrescriptionService) {
        this.medicalPrescriptionService = medicalPrescriptionService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<MedicalPrescriptionDtoGet> getMedicalPrescriptionById(@PathVariable Long id, Authentication authentication) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.getPrescriptionById(id, authentication.getName());
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/all-prescriptions")
    public ResponseEntity<List<MedicalPrescriptionDtoGet>> getAllMedicalPrescriptionByAuthentication(Authentication authentication) {
        String email = authentication.getName();
        List<MedicalPrescriptionDtoGet> prescriptions = medicalPrescriptionService.getAllPrescriptionsByEmail(email);
        return ResponseEntity.ok(prescriptions);
    }


    @PostMapping("/create")
    public ResponseEntity<Boolean> createMedicalPrescription(@RequestBody  MedicalPrescriptionDtoCreate dto, Authentication authentication) {
        Boolean prescription = medicalPrescriptionService.createPrescription(dto, authentication.getName());
        return ResponseEntity.ok(prescription);
    }

    @PatchMapping("/publish/{id}")
    public ResponseEntity<Boolean> publishPrescription(@PathVariable Long id, Authentication authentication) {
        Boolean published = medicalPrescriptionService.publishPrescription(id, authentication.getName());
        return ResponseEntity.ok(published);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMedicalPrescription(@PathVariable Long id, Authentication authentication) {
        medicalPrescriptionService.deletePrescription(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<MedicalPrescriptionDtoGet> updateMedicalPrescription(@RequestBody MedicalPrescriptionDtoUpdate dto, Authentication authentication) {
        MedicalPrescriptionDtoGet prescription = medicalPrescriptionService.updatePrescription(dto, authentication.getName());
        return ResponseEntity.ok(prescription);
    }



}
