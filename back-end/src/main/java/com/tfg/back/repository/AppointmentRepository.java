package com.tfg.back.repository;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.model.Appointment;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByDoctorIdAndAppointmentDateTime(UUID doctorId, LocalDateTime appointmentDateTime);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND DATE(a.appointmentDateTime) = :date")
    List<Appointment> findByDoctorIdAndAppointmentDate(@Param("doctorId") UUID doctorId,
                                                       @Param("date") LocalDate date);

    @Query("SELECT COUNT(DISTINCT a.client.id) FROM Appointment a WHERE a.doctor.id = :doctorId")
    Long countDistinctClientsByDoctorId(@Param("doctorId") UUID doctorId);

    List<Appointment> findByClientId(UUID id);

    @Query("""
    SELECT a FROM Appointment a 
    WHERE a.doctor.id = :id 
      AND a.status IN :status
      AND (:before IS NULL OR a.appointmentDateTime <= :before)
      AND (:after IS NULL OR a.appointmentDateTime >= :after)
    """)
    Page<Appointment> findByDoctorAndStatusAndDateRange(@Param("id") UUID id,
                                                        @Param("status") Collection<AppointmentStatus> status,
                                                        @Param("before") LocalDateTime before,
                                                        @Param("after") LocalDateTime after,
                                                        Pageable pageable);

    List<Appointment> findByDoctorId(UUID id);

    Page<Appointment> findByClientIdAndAppointmentDateTimeAfterAndStatusIn(UUID id, LocalDateTime localDateTime, Collection<AppointmentStatus> statuses, Pageable pageable);

    Page<Appointment> findByClientIdAndAppointmentDateTimeBefore(UUID id, LocalDateTime localDateTime, Pageable pageable);

    List<Appointment> findTop3ByDoctorIdAndAppointmentDateTimeBetweenAndStatusInOrderByAppointmentDateTimeAsc(
            UUID id,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay,
            Collection<AppointmentStatus> statuses
    );

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.client.id = :id
            AND a.status <> 'CANCELLED'
        ORDER BY a.appointmentDateTime DESC
        """)
    List<Appointment> findAppointmentsByClientId(@Param("id") UUID id, Pageable pageable);
}