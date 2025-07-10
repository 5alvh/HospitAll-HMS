package com.tfg.back.model.dtos.labResults;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabResultDtoCreate {

    private String testName;

    private String resultValue;

    private String unit;

    private String referenceRange;

    private LocalDate resultDate;

    private String status;

    private String notes;

    private UUID patientId;

}
