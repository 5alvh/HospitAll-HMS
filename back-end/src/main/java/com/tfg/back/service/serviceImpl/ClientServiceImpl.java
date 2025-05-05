package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.ClientMapper;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
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

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository,ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    @Override
    public Client createClient(ClientDtoCreate client) {
        String email = client.getEmail();
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new UserAlreadyExistsException(client.getEmail());
        }
        Client newClient = clientMapper.toEntity(client);
        return clientRepository.save(newClient);
    }

    @Override
    public Client getClientById(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }

        return clientRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id, SearchType.ID));
    }

    @Override
    public Client getClientByEmail(String email) {
        if (email == null || email.isBlank()){
            throw new IllegalArgumentException("Client email mustn't be null");
        }

        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client updateClient(Long id, ClientDtoUpdate dto) {
        Client client = ClientMapper.updateEntity(getClientById(id), dto);
        return clientRepository.save(client);
    }

    @Override
    public void deleteClient(String email) {
        Client client = getClientByEmail(email);
        clientRepository.delete(client);
    }

    @Override
    public List<Appointment> getAppointmentsByClientEmail(String email) {
        Client client = getClientByEmail(email);
        return client.getAppointments();
    }
}
