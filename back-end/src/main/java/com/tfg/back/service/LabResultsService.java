package com.tfg.back.service;

import com.tfg.back.model.LabResult;
import com.tfg.back.model.dtos.LabResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.LabResults.LabResultDtoGet;

public interface LabResultsService {
    LabResultDtoGet sendLabResult(LabResultDtoCreate labResult, String doctorEmail);
    LabResultDtoGet getLabResultById(Long id);
    LabResult updateLabResult(Long id, LabResultDtoCreate updatedResult);
    void deleteLabResult(Long id, String email);

}
