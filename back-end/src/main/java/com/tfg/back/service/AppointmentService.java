package com.tfg.back.service;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.appointment.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Service implementation for managing appointments.
 * Handles core business logic for appointment operations including booking,
 * cancellation, confirmation, and status updates.
 *
 * <p>Interacts with repositories for appointments, doctors, clients, and notifications
 * to perform CRUD operations and enforce business rules.
 */
public interface AppointmentService {

    List<AppointmentDtoGet> findAppointmentsByClientId(User patient);

    Page<AppointmentDtoGet> findUpcomingAppointmentsByClientId(User patient, Pageable pageable, boolean includeCancelled);

    Page<AppointmentDtoGet> findAppointmentsHistoryByClientId(User patient, Pageable pageable);


    List<AppointmentDtoGet> findAppointmentsByDoctorId(User doctor);

    Page<AppointmentDtoGet> findAppointmentsByDoctorIdPageable(User doctor, Collection<AppointmentStatus> status, LocalDateTime before, LocalDateTime after, Pageable pageable);

    List<AppointmentDtoGet> findAllAppointments();

    AppointmentDtoGet findAppointmentById(Long id);

    void deleteAppointment(Long id);

    void cancelAppointment(Long id);

    void confirmAppointment(Long id);

    void completeAppointment(Long id);

    AppointmentDtoGet bookAppointment(BookAppointmentRequest request, User patient);

    AppointmentDtoGet addDiagnosis(DiagnosisRequest request);

    Long countPatientsForDoctor(User doctor);

    AppointmentDtoGet bookByDoctorWithClientEmail(BookAppointmentByDoctorRequest request, User doctor);

    AppointmentDtoGet bookByDoctorWithClientId(BookAppointmentByDoctorRequest request, User doctor);

    Appointment getAppointment(Long id);

    List<AppointmentDtoGet> getTodayAppointments(UUID id , List<AppointmentStatus> statuses);

    Long countDistinctClientsByDoctorId(UUID id);
}

