package com.tfg.back.service;

import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;

public interface MedicalPrescriptionService {
    /**
     * Create a Medical Prescription {@link Boolean}
     * Creates and saves a new medical prescription in the system.
     *
     * @param dtoCreate the data transfer object containing prescription details
     * @param creatorEmail the email of the healthcare professional creating the prescription
     * @return Boolean indicating whether the prescription was successfully created
     * @throws IllegalArgumentException if input parameters are invalid
     * @throws UserNotFoundException if no user exists with the creator email
     */
    Boolean createPrescription(MedicalPrescriptionDtoCreate dtoCreate, String creatorEmail);

    /**
     * Delete a Medical Prescription
     * Removes a prescription from the system if authorized.
     *
     * @param id the unique ID of the prescription to delete
     * @param creatorEmail the email of the user attempting deletion (must match original creator)
     * @throws PrescriptionNotFoundException if no prescription exists with the given ID
     */
    void deletePrescription(Long id, String creatorEmail);

    /**
     * Get Prescription by ID {@link MedicalPrescriptionDtoGet}
     * Retrieves a specific prescription's information if authorized.
     *
     * @param id the unique ID of the prescription to retrieve
     * @param getterEmail the email of the user requesting the prescription
     * @return MedicalPrescriptionDtoGet the prescription information
     * @throws PrescriptionNotFoundException if no prescription exists with the given ID
     */
    MedicalPrescriptionDtoGet getPrescriptionById(Long id, String getterEmail);

    /**
     * Publish a Prescription {@link Boolean}
     * Marks a prescription as published and makes it available to the patient.
     *
     * @param id the unique ID of the prescription to publish
     * @param creatorEmail the email of the user attempting publication (must match original creator)
     * @return Boolean indicating whether the prescription was successfully published
     * @throws PrescriptionNotFoundException if no prescription exists with the given ID
     */
    Boolean publishPrescription(Long id, String creatorEmail);
}
