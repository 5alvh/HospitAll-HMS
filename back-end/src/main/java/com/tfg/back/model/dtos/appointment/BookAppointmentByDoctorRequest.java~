package com.tfg.back.model.dtos.appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Schema(name = "Book Appointment By Doctor Request", description = "DTO for doctors to book an appointment for a patient")
public record BookAppointmentByDoctorRequest(

        @Schema(description = "ID of the patient", example = "d290f1ee-6c54-4b01-90e6-d701748f0851")
        @Nullable
        UUID patientId,

        @Email(message = "Email should be valid")
        @Schema(description = "Email of the patient", example = "john.doe@example.com")
        String patientEmail,

        @NotNull(message = "Date must not be null")
        @FutureOrPresent(message = "Date must be today or in the future")
        @Schema(description = "Date of the appointment", example = "2025-01-01")
        LocalDate date,

        @NotNull(message = "Start time must not be null")
        @Schema(description = "Start time of the appointment", example = "14:30")
        LocalTime startTime,

        @NotBlank(message = "Reason must not be blank")
        @Size(max = 500, message = "Reason must not exceed 500 characters")
        @Schema(description = "Reason for the appointment", example = "Routine checkup")
        String reason
) {}

