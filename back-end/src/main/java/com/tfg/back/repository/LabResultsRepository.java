package com.tfg.back.repository;

import com.tfg.back.model.LabResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LabResultsRepository extends JpaRepository<LabResult, Long> {

    Page<LabResult> findByPatientId(UUID patientId, Pageable pageable);
}
