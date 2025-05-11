package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.appointment.AppointmentNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.TimeInterval;
import com.tfg.back.model.WorkingHours;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorRepository doctorRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,AppointmentMapper appointmentMapper,DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public AppointmentDtoGet createAppointment(AppointmentCreateDto appointment, String email) {
        //Check if doctor exists
        Doctor doctor = getDoctor(appointment.getDoctorEmail());
        Appointment newAppointment = appointmentMapper.toEntity(appointment, email);
        Appointment savedAppointment = appointmentRepository.save(newAppointment);
        return appointmentMapper.toDtoGet(savedAppointment);
    }

    @Override
    public List<AppointmentDtoGet> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointmentMapper.toDtoGetList(appointments);
    }

    @Override
    public AppointmentDtoGet getAppointmentById(Long id) {
        Appointment appointment = getAppointment(id);
        return appointmentMapper.toDtoGet(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        appointmentRepository.delete(appointment);
    }

    @Override
    public void cancelAppointment(Long id, String email) {
        Appointment appointment = getAppointment(id);
        if (appointment.getClient().getEmail().equals(email) || appointment.getDoctor().getEmail().equals(email) && appointment.canBeCancelled()){
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        }else {
            throw new UnauthorizedToPerformThisAction("You are not authorized to cancel this appointment");
        }

    }

    @Override
    public void confirmAppointment(Long id, String email) {
        Appointment appointment = getAppointment(id);
        if (appointment.getDoctor().getEmail().equals(email) && appointment.isScheduled()){
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            appointmentRepository.save(appointment);
        }else {
            throw new UnauthorizedToPerformThisAction("You are not authorized to confirm this appointment");
        }
    }

    @Override
    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date) {
        // Get doctor's working hours for that day
        Doctor doctor = getDoctor(doctorId);
        Set<WorkingHours> doctorWorkingHours = doctor.getWorkingHours();

        // Get all appointments booked for the doctor on the given day
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateTimeBetween(
                        doctorId,
                        date.atStartOfDay(),
                        date.atTime(23, 59) // end of the day
                );

        // Set of already booked times
        Set<LocalDateTime> bookedTimes = bookedAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .collect(Collectors.toSet());

        // List to store available slots
        List<LocalDateTime> availableSlots = new ArrayList<>();

        // Loop through working hours for the given day
        for (WorkingHours workingHours : doctorWorkingHours) {
            if (workingHours.getDayOfWeek() == date.getDayOfWeek()) {
                // Check each time interval for the day
                for (TimeInterval interval : workingHours.getTimeIntervals()) {
                    LocalDateTime start = LocalDateTime.of(date, interval.getStartTime());
                    LocalDateTime end = LocalDateTime.of(date, interval.getEndTime());

                    // Check for available slots within this interval
                    while (start.isBefore(end)) {
                        if (!bookedTimes.contains(start)) {
                            availableSlots.add(start);
                        }
                        start = start.plusMinutes(30); // adjust duration as needed
                    }
                }
            }
        }

        return availableSlots;
    }

    private Appointment getAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(()-> new AppointmentNotFoundException(id));
    }

    private Doctor getDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));
    }

    private Doctor getDoctor(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(()-> new UserNotFoundException(email, SearchType.EMAIL));
    }
}
