package com.tfg.back.service;

import com.tfg.back.exceptions.department.DepartmentNotFoundException;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.TimeInterval;
import com.tfg.back.model.dtos.doctor.*;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DoctorService {
    /**
     * Get All Doctors {@link List<DoctorDtoGet>}
     * Returns a list of all doctors in the system.
     *
     * @return List<DoctorDtoGet> containing all doctors' information
     */
    List<DoctorDtoGet> getAllDoctors();

    /**
     * Create a New Doctor {@link DoctorDtoGet}
     * Creates and saves a new doctor record in the system.
     *
     * @param dto the doctor data transfer object containing creation details
     * @return DoctorDtoGet the created doctor's information
     * @throws DepartmentNotFoundException if the specified department does not exist
     * @throws UserAlreadyExistsException if a doctor with the same email already exists
     */
    DoctorDtoGet createDoctor(DoctorDtoCreate dto);

    /**
     * Get Doctor by ID {@link DoctorDtoGet}
     * Retrieves a specific doctor's information by their unique identifier.
     *
     * @param id the unique ID of the doctor to retrieve
     * @return DoctorDtoGet the doctor's information
     * @throws UserNotFoundException if no doctor exists with the given ID
     */
    DoctorDtoGet getDoctorById(UUID id);

    /**
     * Get Doctor by Email {@link DoctorDtoGet}
     * Retrieves a specific doctor's information by their email address.
     *
     * @param email the email address of the doctor to retrieve
     * @return DoctorDtoGet the doctor's information
     * @throws UserNotFoundException if no doctor exists with the given email
     */
    DoctorDtoGet getDoctorByEmail(String email);

    /**
     * Delete a Doctor
     * Removes a doctor record from the system by their unique identifier.
     *
     * @param id the unique ID of the doctor to delete
     * @throws UserNotFoundException if no doctor exists with the given ID
     */
    void deleteDoctor(UUID id);

    /**
     * Find Doctor by Email {@link Doctor}
     * Internal method to retrieve the doctor entity by email.
     *
     * @param email the email address to search for
     * @return Doctor the doctor entity
     * @throws UserNotFoundException if no doctor exists with the given email
     */
    Doctor findDoctorByEmail(String email);

    /**
     * Update Doctor Information {@link DoctorDtoGet}
     * Updates and saves an existing doctor's information.
     *
     * @param id the unique ID of the doctor to update
     * @param dto the data transfer object containing update information
     * @return DoctorDtoGet the updated doctor information
     * @throws UserNotFoundException if no doctor exists with the given ID
     */
    DoctorDtoGet updateDoctor(UUID id, DoctorDtoUpdate dto);

    /**
     * Get Available Doctors {@link List<AvailableDoctorGet>}
     * Retrieves a list of available doctors in a specific department on a given date.
     *
     * @param departmentId the ID of the department to filter by
     * @param date the date to check availability for
     * @return List<AvailableDoctorGet> containing available doctors' information
     * @throws DepartmentNotFoundException if no department exists with the given ID
     */
    List<AvailableDoctorGet> getAvailableDoctors(Long departmentId, LocalDate date);

    /**
     * Get Available Time Slots {@link List<TimeInterval>}
     * Retrieves available appointment time slots for a specific doctor on a given date.
     *
     * @param doctorId the ID of the doctor to check availability for
     * @param date the date to check availability for
     * @return List<TimeInterval> containing available time slots
     * @throws UserNotFoundException if no doctor exists with the given ID
     */
    List<TimeInterval> getAvailableSlots(UUID doctorId, LocalDate date);

    /**
     * Get Visited Doctors {@link List<VisitedDoctorGet>}
     * Retrieves a list of doctors that a specific client has visited.
     *
     * @param id the client ID to search visited doctors for
     * @return List<VisitedDoctorGet> containing visited doctors' information
     * @throws UserNotFoundException if no client exists with the given ID
     */
    List<VisitedDoctorGet> getDoctorsClientVisited(Long id);

    void changePassword(String email, ChangePasswordRequest newPassword);
}
