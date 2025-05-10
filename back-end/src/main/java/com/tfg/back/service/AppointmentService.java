package com.tfg.back.service;

import com.tfg.back.model.Appointment;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    AppointmentDtoGet createAppointment(AppointmentCreateDto appointment, String email);
    List<AppointmentDtoGet> getAllAppointments();
    AppointmentDtoGet getAppointmentById(Long id);
    void deleteAppointment(Long id);
    List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date);
}
