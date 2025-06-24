package com.tfg.back.service;

import com.tfg.back.model.Appointment;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.appointment.*;

import java.util.List;

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
}

