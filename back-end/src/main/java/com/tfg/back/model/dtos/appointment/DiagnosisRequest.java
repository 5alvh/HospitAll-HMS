package com.tfg.back.model.dtos.appointment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(name = "Diagnosis Request", description = "DTO for submitting a diagnosis for an appointment")
public record DiagnosisRequest(

        @NotBlank(message = "Diagnosis must not be blank")
        @Size(max = 1000, message = "Diagnosis must not exceed 1000 characters")
        @Schema(description = "Diagnosis details", example = "Patient shows signs of seasonal allergy")
        String diagnosis,

        @NotNull(message = "Appointment ID must not be null")
        @Schema(description = "ID of the related appointment", example = "12345")
        Long appointmentId
) {}