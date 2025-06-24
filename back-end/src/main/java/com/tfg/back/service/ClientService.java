package com.tfg.back.service;

import com.tfg.back.model.User;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.client.SummaryResponse;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;

import java.util.List;
import java.util.UUID;

public interface ClientService {

    ClientDtoGet createClient(ClientDtoCreate clientDto);

    SummaryResponse findClientSummaryById(User patient);

    String findClientFullName(User patient);

    List<ClientDtoGet> findAllClients();

    ClientDtoGet findClientById(User patient);

    ClientDtoGet updateClient(UUID id, ClientDtoUpdate clientDto);

    void changePassword(User patient, ChangePasswordRequest newPassword);

    void deleteClient(UUID email);

    void activateClient(UUID id);

    void inactivateClient(User patient);

    void suspendClient(UUID id);

}
