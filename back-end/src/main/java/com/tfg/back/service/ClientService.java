package com.tfg.back.service;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;

import java.util.List;

public interface ClientService {
    Client createClient(ClientDtoCreate dto);
    Client getClientById(Long id);
    Client getClientByEmail(String email);
    List<Client> getAllClients();
    void deleteClient(String email);
}
