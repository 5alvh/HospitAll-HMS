package com.tfg.back.service;

import com.tfg.back.model.Appointment;

import java.util.List;

public interface AppointmentService {
    Appointment createAppointment(Appointment appointment);
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Long id);
    void deleteAppointment(Long id);
}
