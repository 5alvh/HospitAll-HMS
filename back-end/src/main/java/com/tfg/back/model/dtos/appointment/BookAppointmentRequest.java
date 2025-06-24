package com.tfg.back.model.dtos.appointment;

import com.tfg.back.enums.AppointmentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Schema(name = "Appointment Create DTO", description = "DTO for creating an appointment")
public record BookAppointmentRequest(

        @NotNull(message = "Doctor ID must not be null")
        @Schema(description = "Id of the doctor", example = "1")
        UUID doctorId,

        @NotNull(message = "Date must not be null")
        @FutureOrPresent(message = "Date must be today or in the future")
        @Schema(description = "Date of the appointment", example = "2025-01-01")
        LocalDate date,

        @NotNull(message = "Start time must not be null")
        @Schema(description = "Start time of the appointment", example = "10:00")
        LocalTime startTime,

        @NotNull(message = "Appointment type must not be null")
        @Schema(description = "Type of the appointment", example = "IN_PERSON")
        AppointmentType type,

        @NotBlank(message = "Reason must not be blank")
        @Size(max = 500, message = "Reason must not exceed 500 characters")
        @Schema(description = "Reason for the appointment", example = "I need to see a doctor")
        String reason
) {}

