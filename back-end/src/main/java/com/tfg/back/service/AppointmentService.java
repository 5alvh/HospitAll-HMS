package com.tfg.back.service;

import com.tfg.back.model.Appointment;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;

import java.util.List;

public interface AppointmentService {
    Appointment createAppointment(AppointmentCreateDto appointment);
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Long id);
    void deleteAppointment(Long id);
}
