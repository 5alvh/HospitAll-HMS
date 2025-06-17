package com.tfg.back.model.dtos.appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record BookAppointmentByDoctorRequest(UUID id, String patientEmail, LocalDate date, LocalTime startTime, String reason) {
}
