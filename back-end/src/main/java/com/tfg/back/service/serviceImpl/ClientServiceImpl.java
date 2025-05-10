package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.AppointmentMapper;
import com.tfg.back.mappers.ClientMapper;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository, ClientMapper clientMapper, AppointmentMapper appointmentMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
        this.appointmentMapper = appointmentMapper;
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
    public Client updateClient(Long id, ClientDtoUpdate dto) {
        Client clientToUpdate = findClientById(id);
        Client client = ClientMapper.updateEntity(clientToUpdate, dto);
        return clientRepository.save(client);
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

    private Client findClientByEmail(String email) {
        if (email == null || email.isBlank()){
            throw new IllegalArgumentException("Client email mustn't be null");
        }
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));
    }

    private Client findClientById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        return clientRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id, SearchType.ID));
    }
}
