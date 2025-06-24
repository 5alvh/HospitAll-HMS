package com.tfg.back.service;

import com.tfg.back.model.Client;

import java.util.UUID;

public interface ClientServiceLookUp {
    Client findClientById(UUID id);
    Client findByEmail(String email);
}
