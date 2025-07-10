package com.tfg.back.model.dtos.labResults;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabResultDtoCreate {

    private String testName;

    private String resultValue;

    private String unit;

    private String referenceRange;

    private LocalDate resultDate;

    private String notes;

    private String patientEmail;

    private String status;


}
