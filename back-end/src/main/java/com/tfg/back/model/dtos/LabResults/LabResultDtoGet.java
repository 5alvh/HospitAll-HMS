package com.tfg.back.model.dtos.LabResults;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
