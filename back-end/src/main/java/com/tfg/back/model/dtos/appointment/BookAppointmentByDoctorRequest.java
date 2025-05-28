package com.tfg.back.model.dtos.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookAppointmentByDoctorRequest(Long id,String patientEmail, LocalDate date, LocalTime startTime, String reason) {
}
