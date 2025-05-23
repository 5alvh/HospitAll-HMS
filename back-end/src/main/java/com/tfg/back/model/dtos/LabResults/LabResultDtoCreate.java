package com.tfg.back.model.dtos.LabResults;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabResultDtoCreate {

    private String testName;

    private String resultValue;

    private String unit; // Optional: e.g., "mg/dL", "mmol/L"

    private String referenceRange; // Optional: e.g., "70-110 mg/dL"

    private LocalDate resultDate;

    private String notes;

    private String patientEmail;

    private String status;


}
