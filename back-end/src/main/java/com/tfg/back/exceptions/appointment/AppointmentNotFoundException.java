package com.tfg.back.exceptions.appointment;

public class AppointmentNotFoundException extends RuntimeException {

    public AppointmentNotFoundException(Long id) {
        super("Appointment not found with ID: " + id);
    }
}
