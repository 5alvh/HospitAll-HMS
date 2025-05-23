package com.tfg.back.utils;

import com.tfg.back.enums.AppointmentType;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookAppointmentRequest(Long doctorId, LocalDate date, LocalTime startTime, Long clientId, AppointmentType type, String reason) {
}
