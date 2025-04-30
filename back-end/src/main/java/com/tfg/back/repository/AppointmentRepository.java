package com.tfg.back.repository;

import com.tfg.back.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
