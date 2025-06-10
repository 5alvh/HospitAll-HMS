package com.tfg.back.service;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.exceptions.appointment.AppointmentNotFoundException;
import com.tfg.back.exceptions.appointment.SlotAlreadyBooked;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;

import java.time.LocalDate;
import java.time.LocalTime;
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
    /**
     * Retrieves all appointments in the system.
     *
     * @return List of {@link AppointmentDtoGet} DTOs representing all appointments
     */
    List<AppointmentDtoGet> getAllAppointments();

    /**
     * Retrieves a specific appointment by its ID.
     *
     * @param id ID of the appointment to retrieve
     * @return {@link AppointmentDtoGet} DTO representing the appointment
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    AppointmentDtoGet getAppointmentById(Long id);

    /**
     * Deletes an appointment by its ID.
     *
     * @param id ID of the appointment to delete
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    void deleteAppointment(Long id);

    /**
     * Cancels an appointment. Validates user authorization and appointment cancellation rules.
     *
     * @param id ID of the appointment to cancel
     * @param email Email of the user requesting cancellation
     * @throws UnauthorizedToPerformThisAction if the user is not the client or doctor of the appointment
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     * @throws IllegalStateException if the appointment cannot be cancelled (business rule)
     */
    void cancelAppointment(Long id, String email);

    /**
     * Confirms an appointment. Restricted to the appointment's doctor.
     *
     * @param id ID of the appointment to confirm
     * @param email Email of the doctor confirming the appointment
     * @throws UnauthorizedToPerformThisAction if the user is not the doctor of the appointment
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    void confirmAppointment(Long id, String email);

    /**
     * Marks an appointment as completed. Restricted to the appointment's doctor.
     *
     * @param id ID of the appointment to complete
     * @param email Email of the doctor marking the appointment as completed
     * @throws UnauthorizedToPerformThisAction if the user is not the doctor of the appointment
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    void completeAppointment(Long id, String email);

    /**
     * Books a new appointment for a client with a doctor.
     *
     * @param doctorId ID of the doctor for the appointment
     * @param date Date of the appointment
     * @param startTime Start time of the appointment
     * @param email Email of the client booking the appointment
     * @param type Type of appointment (e.g., IN_PERSON)
     * @param reason Reason for the appointment
     * @param status Initial status of the appointment (typically SCHEDULED)
     * @return {@link AppointmentDtoGet} DTO representing the booked appointment
     * @throws SlotAlreadyBooked if the time slot is already occupied
     * @throws UserNotFoundException if the doctor or client is not found
     */
    AppointmentDtoGet bookAppointment(Long doctorId, LocalDate date, LocalTime startTime, String email, AppointmentType type, String reason, AppointmentStatus status);

    /**
     * Adds a diagnosis to an existing appointment.
     *
     * @param request Diagnosis request containing appointment ID and diagnosis text
     * @return Updated {@link AppointmentDtoGet} DTO with the diagnosis
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    AppointmentDtoGet addDiagnosis(DiagnosisRequest request);

    /**
     * Counts distinct patients for a specific doctor.
     *
     * @param id ID of the doctor
     * @return Number of distinct patients seen by the doctor
     */
    Long getTotalPatientsThatVisitedDoctor(Long id);

    /**
     * Books an appointment by a doctor using a client's email.
     *
     * @param request Booking request containing appointment details
     * @param email Email of the doctor booking the appointment
     * @return {@link AppointmentDtoGet} DTO representing the booked appointment
     * @throws UserNotFoundException if the doctor or client is not found
     */
    AppointmentDtoGet bookAppointmentByDoctorUsingClientEmail(BookAppointmentByDoctorRequest request, String email);

    /**
     * Books an appointment by a doctor using a client's ID.
     *
     * @param request Booking request containing appointment details and client ID
     * @param email Email of the doctor booking the appointment
     * @return {@link AppointmentDtoGet} DTO representing the booked appointment
     * @throws UserNotFoundException if the doctor or client is not found
     */
    AppointmentDtoGet bookAppointmentByDoctorUsingClientId(BookAppointmentByDoctorRequest request, String email);

    /**
     * Internal helper to fetch an appointment by ID.
     *
     * @param id ID of the appointment
     * @return {@link Appointment} entity
     * @throws AppointmentNotFoundException if no appointment exists with the given ID
     */
    Appointment getAppointment(Long id);
}

