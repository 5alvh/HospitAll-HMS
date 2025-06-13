package com.tfg.back.service;

import com.tfg.back.exceptions.labResult.LabResultNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.LabResult;
import com.tfg.back.model.dtos.labResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;

import java.util.List;

public interface LabResultsService {

    List<LabResultDtoGet> getLabResultsByEmail(String email); // TODO: Add pagination
    /**
     * Sends/creates a new lab result for a patient.
     * <p>
     * This method:
     * <ol>
     *   <li>Validates the patient exists by email</li>
     *   <li>Verifies the doctor exists by email</li>
     *   <li>Creates a new lab result entity</li>
     *   <li>Generates a notification for the patient</li>
     *   <li>Persists the lab result</li>
     * </ol>
     *
     * @param labResult The lab result data to be created (contains patient email, results, etc.)
     * @param doctorEmail The email of the doctor submitting the result (must be valid doctor)
     * @return LabResultDtoGet The created lab result with complete information
     * @throws UserNotFoundException If patient or doctor emails don't match existing users
     * @throws IllegalArgumentException If any required fields are missing/invalid
     */
    LabResultDtoGet sendLabResult(LabResultDtoCreate labResult, String doctorEmail);
    /**
     * Retrieves a lab result by its unique identifier.
     *
     * @param id The ID of the lab result to retrieve
     * @return LabResultDtoGet The complete lab result information
     * @throws LabResultNotFoundException If no lab result exists with the specified ID
     */
    LabResultDtoGet getLabResultById(Long id);
    LabResult updateLabResult(Long id, LabResultDtoCreate updatedResult);
    /**
     * Deletes a lab result if authorized.
     * <p>
     * Authorization requires the requesting user to be the same doctor who originally
     * ordered the lab result.
     *
     * @param id The ID of the lab result to delete
     * @param email The email of the user attempting deletion (must match ordering doctor)
     * @throws LabResultNotFoundException If no lab result exists with the specified ID
     * @throws UnauthorizedToPerformThisAction If the email doesn't match the ordering doctor
     */
    void deleteLabResult(Long id, String email);

}
