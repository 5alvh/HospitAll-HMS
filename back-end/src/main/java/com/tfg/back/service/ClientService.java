package com.tfg.back.service;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.*;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ClientService {

    Page<ClientDtoGet> findClients(String search, Pageable pageable);
    ClientDtoGet createClient(ClientDtoCreate clientDto);

    ClientSummaryResponse findClientSummaryById(User patient);

    String findClientFullName(User patient);

    List<ClientDtoGet> findAllClients();

    ClientDtoGet findClientById(User patient);

    ClientDetailsDto getClientDetailsByDoctor(UUID id);
    ClientDtoGet updateClient(UUID id, ClientDtoUpdate clientDto);

    void changePassword(User patient, ChangePasswordRequest newPassword);

    void deleteClient(UUID email);

    void activateClient(UUID id);

    void inactivateClient(User patient);

    void suspendClient(UUID id);

}
