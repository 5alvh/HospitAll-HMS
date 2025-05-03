package com.tfg.back.service;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;

import java.util.List;

public interface ClientService {
    Client createClient(ClientDtoCreate dto);
    Client getClientById(Long id);
    Client getClientByEmail(String email);
    List<Client> getAllClients();
    Client updateClient(Long id, ClientDtoUpdate dto);
    void deleteClient(String email);
}
