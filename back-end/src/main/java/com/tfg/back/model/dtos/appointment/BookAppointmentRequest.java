package com.tfg.back.model.dtos.appointment;

import com.tfg.back.enums.AppointmentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

@Schema(name = "Appointment Create DTO", description = "DTO for creating an appointment")
public record BookAppointmentRequest(
    @Schema(description = "Id of the doctor", example = "1") Long doctorId,
    @Schema(description = "Date of the appointment", example = "2023-01-01") LocalDate date,
    @Schema(description = "Start time of the appointment", example = "10:00")LocalTime startTime,
    @Schema(description = "Type of the appointment", example = "IN_PERSON") AppointmentType type,
    @Schema(description = "Reason for the appointment", example = "I need to see a doctor") String reason) {
}
