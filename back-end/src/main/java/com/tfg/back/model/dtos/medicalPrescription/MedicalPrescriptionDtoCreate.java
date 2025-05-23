package com.tfg.back.model.dtos.medicalPrescription;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicalPrescriptionDtoCreate {

    private String medicationName;

    private String dosage;

    private String frequency;

    private LocalDate startDate;

    private LocalDate endDate;

    private String notes;

    private String clientEmail;
}
