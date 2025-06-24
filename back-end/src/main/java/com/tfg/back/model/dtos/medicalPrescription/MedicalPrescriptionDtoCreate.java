package com.tfg.back.model.dtos.medicalPrescription;


import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.enums.SearchType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record MedicalPrescriptionDtoCreate(

        @NotNull
        @Size(min = 1, message = "At least one medication is required")
        @Schema(description = "List of prescribed medications", required = true)
        Medication[] medications,

        @Email
        @Schema(description = "Client email (used if searchType is EMAIL)")
        String clientEmail,

        @Schema(description = "Client UUID (used if searchType is ID)")
        UUID clientId,

        @NotNull
        @Schema(description = "How to identify the client (by email or ID)", example = "EMAIL or ID", required = true)
        SearchType searchType,

        @NotBlank
        @Schema(description = "ID of the appointment associated with the prescription", example = "b01a505b-3f79-4b7a-9a3f-915263ecc0d4", required = true)
        String appointmentId,

        @NotNull
        @Schema(description = "Status of the prescription", example = "DRAFT or PUBLISHED", required = true)
        PrescriptionStatus status

) {}

