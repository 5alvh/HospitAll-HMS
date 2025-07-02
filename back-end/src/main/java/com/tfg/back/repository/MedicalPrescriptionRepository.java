package com.tfg.back.repository;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.model.MedicalPrescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MedicalPrescriptionRepository extends JpaRepository<MedicalPrescription, Long> {

    @Query("SELECT p FROM MedicalPrescription p WHERE p.prescribedTo.id = :id AND LOWER(p.medicationName) LIKE %:search% OR LOWER(p.prescribedTo.fullName) LIKE %:search%")
    Page<MedicalPrescription> findByPrescribedToId(@Param("id")UUID id, @Param("search")String search, Pageable pageable);

    @Query("SELECT p FROM MedicalPrescription p WHERE p.prescribedBy.id = :id AND LOWER(p.medicationName) LIKE %:search% OR LOWER(p.prescribedTo.fullName) LIKE %:search%")
    Page<MedicalPrescription> findByPrescribedById(@Param("id")UUID id, @Param("search")String search, Pageable pageable);

    @Query("""
        SELECT a FROM MedicalPrescription a
        WHERE a.prescribedTo.id = :email
        ORDER BY a.createdAt DESC
        """)
    List<MedicalPrescription> findPrescriptionsByClientEmail(@Param("email") UUID email, Pageable pageable);

    @Query("SELECT COUNT(m) FROM MedicalPrescription m WHERE m.prescribedBy.id = :id AND m.status = :status")
    Long countByPrescribedByIdAndStatus(
            @Param("id") UUID id,
            @Param("status") PrescriptionStatus status
    );
}
