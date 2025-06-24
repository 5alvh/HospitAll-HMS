package com.tfg.back.repository;

import com.tfg.back.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LabResultsRepository extends JpaRepository<LabResult, Long> {

    List<LabResult> findByPatientId(UUID patientId);
}
