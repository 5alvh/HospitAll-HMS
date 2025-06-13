package com.tfg.back.repository;

import com.tfg.back.model.MedicalPrescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalPrescriptionRepository extends JpaRepository<MedicalPrescription, Long> {

    List<MedicalPrescription> findByPrescribedToEmail(String email);
}
