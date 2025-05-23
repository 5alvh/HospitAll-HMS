package com.tfg.back.service;

import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;

public interface MedicalPrescriptionService {

    MedicalPrescriptionDtoGet createPrescription(MedicalPrescriptionDtoCreate dtoCreate, String creatorEmail);
    void deletePrescription(Long id, String creatorEmail);
    MedicalPrescriptionDtoGet getPrescriptionById(Long id, String getterEmail);
}
