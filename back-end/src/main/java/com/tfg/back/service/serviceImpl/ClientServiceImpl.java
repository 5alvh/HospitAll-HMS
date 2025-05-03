package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.ClientMapper;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public Client createClient(ClientDtoCreate client) {
        String email = client.getEmail();
        boolean exists = clientRepository.existsByEmail(client.getEmail());
        if (exists){
            throw new UserAlreadyExistsException(email);
        }
        Client newClient = ClientMapper.toEntity(client);
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
        Client client = this.getClientByEmail(email);
        clientRepository.deleteById(client.getId());
    }
}
