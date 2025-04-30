package com.tfg.back.service;

import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;

import java.util.List;

public interface ClientService {
    Client createClient(ClientDtoCreate dto);
    Client getClient(Long id);
    List<Client> getAllClients();
    boolean deleteClient(Long id);
}
