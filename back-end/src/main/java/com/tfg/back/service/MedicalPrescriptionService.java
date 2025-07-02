package com.tfg.back.service;

import com.tfg.back.model.User;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface MedicalPrescriptionService {

    Page<MedicalPrescriptionDtoGet> findPrescriptionsByPatientId(User user, String search, Pageable pageable);

    Page<MedicalPrescriptionDtoGet> findPrescriptionsByDoctorId(User user, String search,Pageable pageable);

    Boolean createPrescription(MedicalPrescriptionDtoCreate dtoCreate, User doctor);

    void deletePrescription(Long id, User doctor);

    MedicalPrescriptionDtoGet findPrescriptionById(Long id, User user);

    Boolean publishPrescription(Long id, User doctor);

    MedicalPrescriptionDtoGet updatePrescription(MedicalPrescriptionDtoUpdate dto, User doctor);

    Long countPendingPrescriptionsByDoctorId(UUID uuid);
}
