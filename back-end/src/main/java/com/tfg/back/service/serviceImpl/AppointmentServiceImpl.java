package com.tfg.back.service.serviceImpl;

import com.tfg.back.exceptions.appointment.AppointmentNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,AppointmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Override
    public Appointment createAppointment(AppointmentCreateDto appointment) {
        Appointment newAppointment = appointmentMapper.toEntity(appointment);
        return appointmentRepository.save(newAppointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(()-> new AppointmentNotFoundException(id));
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointmentRepository.delete(appointment);
    }

    @Override
    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date) {
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateTimeBetween(
                        doctorId,
                        date.atTime(9, 0),
                        date.atTime(17, 0)
                );

        Set<LocalDateTime> bookedTimes = bookedAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .collect(Collectors.toSet());

        List<LocalDateTime> availableSlots = new ArrayList<>();
        LocalDateTime start = date.atTime(9, 0);
        LocalDateTime end = date.atTime(17, 0);

        while (start.isBefore(end)) {
            if (!bookedTimes.contains(start)) {
                availableSlots.add(start);
            }
            start = start.plusMinutes(30); // adjust duration as needed
        }

        return availableSlots;
    }
}
