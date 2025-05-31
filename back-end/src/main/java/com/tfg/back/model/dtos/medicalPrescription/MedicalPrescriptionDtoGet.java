package com.tfg.back.model.dtos.medicalPrescription;

import com.tfg.back.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MedicalPrescriptionDtoGet {

    private Long id;

    private String medicationName;

    private String dosage;

    private String frequency;

    private LocalDate startDate;

    private LocalDate endDate;

    private String notes;

    private String prescribedBy;

    private LocalDateTime createdAt;

    private String prescribedTo;

    private String clientEmail;

    private PrescriptionStatus status;
}
