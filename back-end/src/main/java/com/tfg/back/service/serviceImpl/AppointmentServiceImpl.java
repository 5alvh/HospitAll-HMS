package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.appointment.AppointmentNotFoundException;
import com.tfg.back.exceptions.appointment.SlotAlreadyBooked;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;


@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorRepository doctorRepository;
    private final NotificationRepository notificationRepository;
    private final ClientRepository clientRepository;
    public final EmailService emailService;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, DoctorRepository doctorRepository, NotificationRepository notificationRepository, ClientRepository clientRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.doctorRepository = doctorRepository;
        this.notificationRepository = notificationRepository;
        this.clientRepository = clientRepository;
        this.emailService = emailService;
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

        if (appointment.getDoctor().getEmail().equals(email)){
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            appointmentRepository.save(appointment);
            createAppointmentNotification(appointment.getClient(),
                    "Appointment Confirmed", "Appointment confirmed by: " +
                    appointment.getClient().getFullName());
        }else {
            throw new UnauthorizedToPerformThisAction("You are not authorized to confirm this appointment");
        }
    }

    @Override
    public void completeAppointment(Long id, String email) {
        Appointment appointment = getAppointment(id);

        if (appointment.getDoctor().getEmail().equals(email)){
            appointment.setStatus(AppointmentStatus.COMPLETED);
            appointmentRepository.save(appointment);
            createAppointmentNotification(appointment.getClient(),
                    "Appointment Confirmed", "Appointment confirmed by: " +
                            appointment.getClient().getFullName());
        }else {
            throw new UnauthorizedToPerformThisAction("You are not authorized to confirm this appointment");
        }
    }

    @Override
    public AppointmentDtoGet bookAppointment(Long doctorId, LocalDate date, LocalTime startTime, String email, AppointmentType type, String reason, AppointmentStatus status) {
        LocalDateTime appointmentDateTime = LocalDateTime.of(date, startTime);

        // Check if slot is already taken
        boolean exists = appointmentRepository.existsByDoctorIdAndAppointmentDateTime(
                doctorId, appointmentDateTime);

        if (exists) {
            throw new SlotAlreadyBooked("The selected slot is already booked.");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new UserNotFoundException(doctorId, SearchType.ID));

        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));


        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .client(client)
                .department(doctor.getDepartment())
                .appointmentDateTime(appointmentDateTime)
                .type(type)
                .reason(reason)
                .status(AppointmentStatus.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .diagnosis("UNAVAILABLE")
                .build();

        createAppointmentNotification(appointment.getClient(), "New Appointment!!", "You have a new appointment, check your appointments");
        Appointment savedAppointment = appointmentRepository.save(appointment);
        emailService.sendAppointmentBookedEmail(email, client.getFullName(), "CLIENT", doctor.getFullName(), date.toString(), startTime.toString(), savedAppointment.getId().toString());
        return appointmentMapper.toDtoGet(savedAppointment);
    }

    @Override
    public AppointmentDtoGet bookAppointmentByDoctorUsingClientEmail(BookAppointmentByDoctorRequest request, String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));

        Client client = clientRepository.findByEmail(request.patientEmail())
                .orElseThrow(() -> new UserNotFoundException(request.patientEmail(), SearchType.EMAIL));

        return bookAppointment(doctor.getId(), request.date(), request.startTime(), client.getEmail(), AppointmentType.IN_PERSON, request.reason(), AppointmentStatus.CONFIRMED);
    }

    @Override
    public AppointmentDtoGet bookAppointmentByDoctorUsingClientId(BookAppointmentByDoctorRequest request, String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));

        Client client = clientRepository.findById(request.id())
                .orElseThrow(() -> new UserNotFoundException(request.id(), SearchType.ID));

        return bookAppointment(doctor.getId(), request.date(), request.startTime(), client.getEmail(), AppointmentType.IN_PERSON, request.reason(), AppointmentStatus.CONFIRMED);
    }

    @Override
    public AppointmentDtoGet addDiagnosis(DiagnosisRequest request) {
        Appointment appointment = getAppointment(request.appointmentId());
        appointment.setDiagnosis(request.diagnosis());
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        createAppointmentNotification(appointment.getClient(), "Diagnosis added!", "Diagnosis added by " + appointment.getDoctor().getFullName()+", Check your appointments section");
        return appointmentMapper.toDtoGet(updatedAppointment);
    }

    @Override
    public Long getTotalPatientsThatVisitedDoctor(Long id) {
        return appointmentRepository.countDistinctClientsByDoctorId(id);
    }

    public Appointment getAppointment(Long id) {
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

    private void createAppointmentNotification(User user, String message, String title) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setSeen(false);
        notification.setType("APPOINTMENT");
        notification.setDate(LocalDateTime.now());
        notification.setUser(user);
        notificationRepository.save(notification);
    }

    /*
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
     */
}
