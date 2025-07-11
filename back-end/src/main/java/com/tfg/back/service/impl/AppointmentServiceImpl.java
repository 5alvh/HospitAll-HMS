package com.tfg.back.service.impl;

import static com.tfg.back.constants.AppoitmentContants.*;

import com.tfg.back.constants.Roles;
import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.enums.NotificationType;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.appointment.AppointmentNotFoundException;
import com.tfg.back.exceptions.appointment.SlotAlreadyBooked;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.model.dtos.appointment.BookAppointmentRequest;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.service.AppointmentService;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;
import com.tfg.back.service.ClientServiceLookUp;
import com.tfg.back.service.DoctorServiceLookUp;
import com.tfg.back.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorServiceLookUp doctorService;
    private final NotificationService notificationService;
    private final ClientServiceLookUp clientService;
    public final EmailService emailService;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, DoctorServiceLookUp doctorService, NotificationService notificationService, ClientServiceLookUp clientService, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.doctorService = doctorService;
        this.notificationService = notificationService;
        this.clientService = clientService;
        this.emailService = emailService;
    }

    @Override
    public List<AppointmentDtoGet> findAppointmentsByClientId(User patient) {
        List<Appointment> appointments = appointmentRepository.findByClientId(patient.getId());
        return appointmentMapper.toDtoGetList(appointments);
    }

    @Override
    public Page<AppointmentDtoGet> findUpcomingAppointmentsByClientId(User patient, Pageable pageable, boolean includeCancelled) {
        List<AppointmentStatus> statuses = includeCancelled? List.of(AppointmentStatus.SCHEDULED,AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED): List.of(AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED,AppointmentStatus.SCHEDULED);
        return appointmentRepository.findByClientIdAndAppointmentDateTimeAfterAndStatusIn(patient.getId(),LocalDateTime.now(),statuses, pageable).map(appointmentMapper::toDtoGet);
    }

    @Override
    public Page<AppointmentDtoGet> findAppointmentsHistoryByClientId(User patient, Pageable pageable) {
        return appointmentRepository.findByClientIdAndAppointmentDateTimeBefore(patient.getId(), LocalDateTime.now(),pageable).map(appointmentMapper::toDtoGet);
    }

    @Override
    public List<AppointmentDtoGet> findAppointmentsByDoctorId(User doctor) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());
        return appointmentMapper.toDtoGetList(appointments);
    }

    @Override
    public Page<AppointmentDtoGet> findAppointmentsByDoctorIdPageable(User doctor, Collection<AppointmentStatus> status, LocalDateTime before, LocalDateTime after,Pageable pageable) {
        return appointmentRepository.findByDoctorAndStatusAndDateRange(doctor.getId(), status,before, after, pageable)
                .map(appointmentMapper::toDtoGet);

    }
    @Override
    public List<AppointmentDtoGet> findAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointmentMapper.toDtoGetList(appointments);
    }

    @Override
    public AppointmentDtoGet findAppointmentById(Long id) {
        Appointment appointment = getAppointment(id);
        return appointmentMapper.toDtoGet(appointment);
    }


    // Patient function
    @Override
    public AppointmentDtoGet bookAppointment(BookAppointmentRequest request, User patient) {

        UUID doctorId = request.doctorId();
        LocalDate date = request.date();
        LocalTime startTime = request.startTime();
        AppointmentType type = request.type();
        String reason = request.reason();
        AppointmentStatus status = AppointmentStatus.SCHEDULED;
        return bookAppointmentInternal(doctorId, date, startTime, patient.getId(), type, reason, status);
    }




    //Doctor function
    @Override
    public AppointmentDtoGet bookByDoctorWithClientId(BookAppointmentByDoctorRequest request, User doctor) {
        Client client = clientService.findClientById(request.patientId());
        return bookAppointmentByDoctor(client,request, doctor);
    }


    public AppointmentDtoGet bookAppointmentByDoctor(Client patient, BookAppointmentByDoctorRequest request, User doctor){
        return bookAppointmentInternal(doctor.getId(), request.date(), request.startTime(), patient.getId(), AppointmentType.IN_PERSON, request.reason(), AppointmentStatus.CONFIRMED);
    }

    @PreAuthorize("@appointmentSecurityService.canCancelAppointment(#id, authentication)")
    @Transactional
    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @PreAuthorize("@appointmentSecurityService.canUpdateAppointmentStatus(#id, authentication)")
    @Transactional
    @Override
    public void confirmAppointment(Long id) {
        updateAppointmentStatus(id, AppointmentStatus.CONFIRMED);
    }

    @PreAuthorize("@appointmentSecurityService.canUpdateAppointmentStatus(#id, authentication)")
    @Transactional
    @Override
    public void completeAppointment(Long id) {
        updateAppointmentStatus(id, AppointmentStatus.COMPLETED);
    }

    private void updateAppointmentStatus(Long id, AppointmentStatus status){
        Appointment appointment = getAppointment(id);
        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        sendStatusUpdateNotification(updatedAppointment, status);
    }

    private void sendStatusUpdateNotification(Appointment appointment, AppointmentStatus status) {
        String title = status == AppointmentStatus.COMPLETED? "Appointment Completed":"Appointment Confirmed";
        String message = status == AppointmentStatus.COMPLETED? "Appointment completed, leave a review!"
                : "Appointment confirmed by doctor: " + appointment.getDoctor().getFullName();
        notificationService.createNotification(appointment.getClient(), title, message, NotificationType.APPOINTMENT);
    }

    @Transactional
    @Override
    public AppointmentDtoGet addDiagnosis(DiagnosisRequest request) {

        Appointment appointment = getAppointment(request.appointmentId());
        appointment.setDiagnosis(request.diagnosis());
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        notificationService.createNotification(appointment.getClient(), "Diagnosis added!",
                "Diagnosis added by " + appointment.getClient().getFullName()+", Check your appointments section",
                NotificationType.DIAGNOSIS);
        return appointmentMapper.toDtoGet(updatedAppointment);
    }

    @Override
    public Long countPatientsForDoctor(User doctor) {
        return appointmentRepository.countDistinctClientsByDoctorId(doctor.getId());
    }

    @Override
    public Appointment getAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(()-> new AppointmentNotFoundException(id));
    }

    @Override
    public List<AppointmentDtoGet> getTodayAppointments(UUID id, List<AppointmentStatus> statuses) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        List<Appointment> appointments = appointmentRepository.findTop3ByDoctorIdAndAppointmentDateTimeBetweenAndStatusInOrderByAppointmentDateTimeAsc(id, startOfDay, endOfDay, statuses);
        return appointmentMapper.toDtoGetList(appointments);
    }

    @Override
    public Long countDistinctClientsByDoctorId(UUID id) {
        return appointmentRepository.countDistinctClientsByDoctorId(id);
    }

    @Transactional
    @Override
    public void deleteAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        appointmentRepository.delete(appointment);
    }

    private AppointmentDtoGet bookAppointmentInternal( UUID doctorId, LocalDate date, LocalTime startTime, UUID patientId, AppointmentType type, String reason, AppointmentStatus status) {

        LocalDateTime appointmentDateTime = LocalDateTime.of(date, startTime);

        // Check if slot is already taken
        boolean exists = appointmentRepository.existsByDoctorIdAndAppointmentDateTime(
                doctorId, appointmentDateTime);

        if (exists) {
            throw new SlotAlreadyBooked("The selected slot is already booked.");
        }

        Doctor doctor = doctorService.findDoctorById(doctorId);

        Client client = clientService.findClientById(patientId);


        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .client(client)
                .department(doctor.getDepartment())
                .appointmentDateTime(appointmentDateTime)
                .type(type)
                .reason(reason)
                .status(AppointmentStatus.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .diagnosis(DEFAULT_DIAGNOSIS)
                .build();

        notificationService.createNotification(appointment.getClient(), "New Appointment!!", "You have a new appointment, check your appointments", NotificationType.APPOINTMENT);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        emailService.sendAppointmentBookedEmail(client.getEmail(), client.getFullName(), Roles.CLIENT, doctor.getFullName(), date.toString(), startTime.toString(), savedAppointment.getId().toString());
        emailService.sendAppointmentBookedEmail(doctor.getEmail(), client.getFullName(), Roles.DOCTOR, doctor.getFullName(), date.toString(), startTime.toString(), savedAppointment.getId().toString());
        return appointmentMapper.toDtoGet(savedAppointment);
    }
}
