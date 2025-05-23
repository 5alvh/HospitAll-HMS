package com.tfg.back.service;

import com.tfg.back.enums.AppointmentType;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    AppointmentDtoGet createAppointment(AppointmentCreateDto appointment, String email);
    List<AppointmentDtoGet> getAllAppointments();
    AppointmentDtoGet getAppointmentById(Long id);
    void deleteAppointment(Long id);
    void cancelAppointment(Long id, String email);
    void confirmAppointment(Long id, String email);

    AppointmentDtoGet bookAppointment(Long doctorId, LocalDate date, LocalTime startTime, Long clientId, AppointmentType type, String reason);
}
