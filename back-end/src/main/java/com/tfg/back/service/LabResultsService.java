package com.tfg.back.service;

import com.tfg.back.exceptions.labResult.LabResultNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.LabResult;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.labResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;

import java.util.List;
import java.util.UUID;

public interface LabResultsService {

    List<LabResultDtoGet> findLabResultsByPatientId(User patient);

    LabResultDtoGet createLabResult(LabResultDtoCreate labResult, User doctor);

    LabResultDtoGet findLabResultById(Long id);

    LabResult updateLabResult(Long id, LabResultDtoCreate updatedResult);

    void deleteLabResult(Long id);

    LabResult getLabResult(Long id);
}
