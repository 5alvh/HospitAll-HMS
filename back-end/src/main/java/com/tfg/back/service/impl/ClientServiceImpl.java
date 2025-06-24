package com.tfg.back.service.impl;

import static com.tfg.back.constants.ResponseMessages.*;

import com.tfg.back.enums.NotificationType;
import com.tfg.back.enums.SearchType;
import com.tfg.back.enums.UserStatus;
import com.tfg.back.exceptions.user.IncorrectPasswordException;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.mappers.ClientMapper;
import com.tfg.back.mappers.MedicalPrescriptionMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.client.SummaryResponse;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.ClientService;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;
import com.tfg.back.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final AppointmentMapper appointmentMapper;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AppointmentRepository appointmentRepository;
    private final MedicalPrescriptionRepository medicalPrescriptionRepository;
    private final NotificationService notificationService;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository, ClientMapper clientMapper, AppointmentMapper appointmentMapper, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder, EmailService emailService, AppointmentRepository appointmentRepository, MedicalPrescriptionRepository medicalPrescriptionRepository, NotificationService notificationService) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
        this.appointmentMapper = appointmentMapper;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.appointmentRepository = appointmentRepository;
        this.medicalPrescriptionRepository = medicalPrescriptionRepository;
        this.notificationService = notificationService;
    }

    @Override
    public ClientDtoGet createClient(ClientDtoCreate client) {
        validatePasswords(client.password(), client.passwordConfirmation());
        checkEmailUniqueness(client.email());

        Client clientEntity = clientMapper.toEntity(client);
        Client savedClient = clientRepository.save(clientEntity);

        notificationService.createNotification(savedClient, "Welcome!", "Welcome to our platform", NotificationType.WELCOME);
        emailService.sendWelcomeEmail(savedClient.getEmail(), savedClient.getFullName(), "client");

        return clientMapper.toGetDto(savedClient);
    }

    private void validatePasswords(String password, String confirmation) {
        if (!Objects.equals(password, confirmation)) {
            throw new IllegalArgumentException(PASSWORD_DOES_NOT_MATCH);
        }
    }

    private void checkEmailUniqueness(String email) {
        if (clientRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email);
        }
    }

    @Override
    public SummaryResponse findClientSummaryById(User patient) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByClientId(patient.getId(), PageRequest.of(0,3));
        List<MedicalPrescription> prescriptions = medicalPrescriptionRepository.findPrescriptionsByClientEmail(patient.getId(), PageRequest.of(0,3));
        List<Notification> notifications = notificationRepository.findTop3ByUserIdAndSeenFalseOrderByDateDesc(patient.getId());
        //Mapping
        List<AppointmentDtoGet> appointmentsDto = appointmentMapper.toDtoGetList(appointments);
        List<MedicalPrescriptionDtoGet> prescriptionsDto = MedicalPrescriptionMapper.toDtoGetList(prescriptions);

        SummaryResponse summary = new SummaryResponse(appointmentsDto, prescriptionsDto, notifications);
        return summary;
    }

    @Override
    public String findClientFullName(User patient) {
        String fullName = clientRepository.findFullNameById(patient.getId());
        return fullName;
    }

    //NOTE: Public Crud methods
    @Override
    public List<ClientDtoGet> findAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clientMapper.toGetDtoList(clients);
    }

    @Override
    public ClientDtoGet findClientById(User patient) {
        Client client = findClientById(patient.getId());
        return clientMapper.toGetDto(client);
    }

    @Override
    public ClientDtoGet updateClient(UUID id, ClientDtoUpdate dto) {
        Client clientToUpdate = findClientById(id);
        Client client = clientMapper.updateEntity(clientToUpdate, dto);
        Client updatedClient = clientRepository.save(client);
        Client savedUpdatedClient = clientRepository.save(updatedClient);
        notificationService.createNotification(savedUpdatedClient, "Profile updated", PROFILE_UPDATED_SUCCESSFULLY, NotificationType.UPDATE);
        return clientMapper.toGetDto(savedUpdatedClient);
    }

    @Override
    public void changePassword(User patient, ChangePasswordRequest newPassword) {
        Client client = findClientById(patient.getId());

        if (!passwordEncoder.matches(newPassword.getCurrentPassword(), client.getHashedPassword())) {
            throw new IncorrectPasswordException(INCORRECT_PASSWORD);
        }

        client.setHashedPassword(passwordEncoder.encode(newPassword.getNewPassword()));
        clientRepository.save(client);

        notificationService.createNotification(client, "Password changed", PASSWORD_CHANGED_SUCCESSFULLY, NotificationType.UPDATE);
    }

    //NOTE: Status methods
    @Override
    public void activateClient(UUID id) {
        Client client = findClientById(id);
        client.setStatus(UserStatus.ACTIVE);
        clientRepository.save(client);
    }

    @Override
    public void suspendClient(UUID id) {
        Client client = findClientById(id);
        client.setStatus(UserStatus.SUSPENDED);
        clientRepository.save(client);
    }

    @Override
    public void inactivateClient(User patient) {
        Client client = findClientById(patient.getId());
        client.setStatus(UserStatus.INACTIVE);
        clientRepository.save(client);
    }

    //XXX: NEED A PREAUTHORISATION SERVICE
    @Override
    public void deleteClient(UUID id) {
        Client client = findClientById(id);
        clientRepository.delete(client);
    }

    //NOTE: Methods for internal service-to-service use(now replaced by lookup interfaces)
    private Client findClientById(UUID id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id, SearchType.ID));
    }

}
