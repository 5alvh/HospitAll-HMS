package com.tfg.back.service;

import com.tfg.back.model.User;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoUpdate;

import java.util.List;

public interface MedicalPrescriptionService {

    List<MedicalPrescriptionDtoGet> findPrescriptionsByPatientId(User user);

    Boolean createPrescription(MedicalPrescriptionDtoCreate dtoCreate, User doctor);

    void deletePrescription(Long id, User doctor);

    MedicalPrescriptionDtoGet findPrescriptionById(Long id, User user);

    Boolean publishPrescription(Long id, User doctor);

    MedicalPrescriptionDtoGet updatePrescription(MedicalPrescriptionDtoUpdate dto, User doctor);
}
