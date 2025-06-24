package com.tfg.back.repository;

import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.MedicalPrescription;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {

    Optional<Client> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT c.fullName FROM Client c WHERE c.id = :id")
    String findFullNameById(@Param("id") UUID id);

}
