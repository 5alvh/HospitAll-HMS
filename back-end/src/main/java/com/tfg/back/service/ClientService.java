package com.tfg.back.service;

import com.tfg.back.model.Client;

import java.util.List;

public interface ClientService {
    Client createClient(Client dto);
    Client getClient(Long id);
    List<Client> getAllClients();
    void deleteClient(Long id);
}
