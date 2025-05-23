package com.tfg.back.repository;

import com.tfg.back.model.MedicalPrescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalPrescriptionRepository extends JpaRepository<MedicalPrescription, Long> {
}
