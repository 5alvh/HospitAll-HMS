package com.tfg.back.model.dtos.appointment;

import com.tfg.back.enums.AppointmentType;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookAppointmentRequest(Long doctorId,
                                     LocalDate date,
                                     LocalTime startTime,
                                     AppointmentType type,
                                     String reason) {
}
