package com.tfg.back.repository;

import com.tfg.back.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabResultsRepository extends JpaRepository<LabResult, Long> {
}
