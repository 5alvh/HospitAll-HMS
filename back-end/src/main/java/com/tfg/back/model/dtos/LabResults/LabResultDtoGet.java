package com.tfg.back.model.dtos.labResults;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LabResultDtoGet {

    private Long id;

    private String testName;

    private String resultValue;

    private String unit;

    private String referenceRange;

    private LocalDate resultDate;

    private String notes;

    private String patientFullName;

    private String doctorFullName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long version;

    private String status;

}
