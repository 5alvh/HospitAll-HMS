package com.tfg.back.repository;

import com.tfg.back.model.MedicalPrescription;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicalPrescriptionRepository extends JpaRepository<MedicalPrescription, Long> {

    List<MedicalPrescription> findByPrescribedToEmail(String email);

    @Query("""
        SELECT a FROM MedicalPrescription a
        WHERE a.prescribedTo.email = :email
        ORDER BY a.createdAt DESC
        """)
    List<MedicalPrescription> findPrescriptionsByClientEmail(@Param("email") String email, Pageable pageable);
}
