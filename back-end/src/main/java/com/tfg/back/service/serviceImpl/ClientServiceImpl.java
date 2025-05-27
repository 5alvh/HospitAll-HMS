package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.enums.UserStatus;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.mappers.ClientMapper;
import com.tfg.back.model.Client;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.doctor.DoctorDtoGet;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.ClientService;
import com.tfg.back.model.dtos.ChangePasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final AppointmentMapper appointmentMapper;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository, ClientMapper clientMapper, AppointmentMapper appointmentMapper, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
        this.appointmentMapper = appointmentMapper;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ClientDtoGet createClient(ClientDtoCreate client) {

        if (!client.getPassword().equals(client.getPasswordConfirmation())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String email = client.getEmail();
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new UserAlreadyExistsException(client.getEmail());
        }
        Client newClient = clientMapper.toEntity(client);
        Client clientSaved = clientRepository.save(newClient);
        createNotifications(clientSaved);
        return clientMapper.toGetDto(clientSaved);
    }

    @Override
    public ClientDtoGet getClientById(Long id) {
        Client client = findClientById(id);
        return clientMapper.toGetDto(client);
    }

    @Override
    public ClientDtoGet getClientByEmail(String email) {
        Client client = findClientByEmail(email);
        return clientMapper.toGetDto(client);
    }

    @Override
    public List<ClientDtoGet> getAllClients() {
        List<Client> clients = clientRepository.findAll();

        return clientMapper.toGetDtoList(clients);
    }

    @Override
    public ClientDtoGet updateClient(Long id, ClientDtoUpdate dto) {
        Client clientToUpdate = findClientById(id);
        Client client = clientMapper.updateEntity(clientToUpdate, dto);
        Client updatedClient = clientRepository.save(client);
        Client savedUpdatedClient = clientRepository.save(updatedClient);
        updateNotifications(savedUpdatedClient,"Your profile has been updated successfully!");
        return clientMapper.toGetDto(savedUpdatedClient);
    }

    @Override
    public void deleteClient(String email) {
        Client client = findClientByEmail(email);
        clientRepository.delete(client);
    }

    @Override
    public List<AppointmentDtoGet> getAppointmentsByClientEmail(String email) {
        Client client = findClientByEmail(email);
        return appointmentMapper.toDtoGetList(client.getAppointments());
    }

    @Override
    public void inactivateClient(String email) {
        Client client = findClientByEmail(email);
        client.setStatus(UserStatus.INACTIVE);
        clientRepository.save(client);
    }

    @Override
    public List<Notification> getClientsNotifications(String email) {
        Client client = findClientByEmail(email);
        return client.getNotifications();
    }

    @Override
    public Client findClientByEmail(String email) {
        if (email == null || email.isBlank()){
            throw new IllegalArgumentException("Client email mustn't be null");
        }
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest newPassword) {
        Client client = findClientByEmail(email);
        if (passwordEncoder.matches(newPassword.getCurrentPassword(), client.getHashedPassword())){
            client.setHashedPassword(passwordEncoder.encode(newPassword.getNewPassword()));
            updateNotifications(client, "Your password has been changed successfully!");
        }else {
            throw new IllegalArgumentException("Current password is incorrect");
        }
    }

    @Override
    public void activateClient(String email) {
        Client client = findClientByEmail(email);
        client.setStatus(UserStatus.ACTIVE);
        clientRepository.save(client);
    }

    @Override
    public void suspendClient(String email) {
        Client client = findClientByEmail(email);
        client.setStatus(UserStatus.SUSPENDED);
        clientRepository.save(client);
    }



    private Client findClientById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        return clientRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id, SearchType.ID));
    }
    public void createNotifications(Client client) {
        Notification notification = new Notification();
        notification.setTitle("Welcome!");
        notification.setMessage("Welcome to our platform!");
        notification.setType("WELCOME");
        notification.setSeen(false);
        notification.setDate(LocalDateTime.now());
        notification.setUser(client);
        notificationRepository.save(notification);
    }

    public void updateNotifications(Client client, String message) {
        Notification notification = new Notification();
        notification.setTitle("Updated!");
        notification.setMessage(message);
        notification.setType("UPDATE");
        notification.setSeen(false);
        notification.setDate(LocalDateTime.now());
        notification.setUser(client);
        notificationRepository.save(notification);
    }
}
