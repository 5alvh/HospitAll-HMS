package com.tfg.back.service;

import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;

import java.util.List;

public interface ClientService {
    ClientDtoGet createClient(ClientDtoCreate dto);
    ClientDtoGet getClientById(Long id);
    ClientDtoGet getClientByEmail(String email);
    List<ClientDtoGet> getAllClients();
    Client updateClient(Long id, ClientDtoUpdate dto);
    void deleteClient(String email);
    List<AppointmentDtoGet> getAppointmentsByClientEmail(String email);
    void inactivateClient(String email);
}
