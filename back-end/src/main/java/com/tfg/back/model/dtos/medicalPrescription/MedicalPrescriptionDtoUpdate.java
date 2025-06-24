package com.tfg.back.model.dtos.medicalPrescription;



import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record MedicalPrescriptionDtoUpdate(

        @NotNull
        @Positive
        @Schema(description = "ID of the medical prescription to update", example = "123", required = true)
        Long id,

        @NotBlank
        @Size(max = 100)
        @Schema(description = "Name of the medication", example = "Ibuprofen", required = true)
        String medicationName,

        @NotBlank
        @Size(max = 50)
        @Schema(description = "Dosage instructions", example = "200mg", required = true)
        String dosage,

        @NotBlank
        @Size(max = 50)
        @Schema(description = "Frequency of intake", example = "Twice a day", required = true)
        String frequency,

        @NotNull
        @Schema(description = "Start date of the prescription", example = "2025-07-01", required = true)
        LocalDate startDate,

        @Positive
        @Schema(description = "Duration of the prescription in days", example = "7", required = true)
        int duration,

        @Size(max = 255)
        @Schema(description = "Optional notes for the prescription", example = "Take after meals")
        String notes,

        @Email
        @Schema(description = "Email of the person the prescription is for", example = "patient@example.com")
        String prescribedEmail

) {}
