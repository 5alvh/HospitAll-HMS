package com.tfg.back.mappers;

import com.tfg.back.enums.SearchType;
import com.tfg.back.enums.UserStatus;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class ClientMapper {

    private final PasswordEncoder passwordEncoder;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    public ClientMapper(PasswordEncoder passwordEncoder, AppointmentMapper appointmentMapper) {
        this.passwordEncoder = passwordEncoder;
        this.appointmentMapper = appointmentMapper;
    }

    public Client toEntity(ClientDtoCreate dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Client is null");
        }

        Client client = new Client();

        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setDateOfBirth(dto.getDateOfBirth());

        client.setStatus(UserStatus.ACTIVE);
        client.setCreatedAt(LocalDateTime.now());

        client.setMembershipLevel(dto.getMembershipLevel());
        client.setEmergencyContact(dto.getEmergencyContact());

        client.setAppointments(new ArrayList<>());

        return client;
    }

    public static Client updateEntity(Client client, ClientDtoUpdate dto){
        if (dto == null){
            throw new IllegalArgumentException("ClientDtoUpdate is null");
        }

        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setHashedPassword(dto.getPassword());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setDateOfBirth(dto.getDateOfBirth());

        client.setStatus(UserStatus.ACTIVE);

        client.setMembershipLevel(dto.getMembershipLevel());
        client.setEmergencyContact(dto.getEmergencyContact());

        /*
        I SHOULD TEST LAST UPDATED AT IF IT'S WORKING
         */
        client.setUpdatedAt(LocalDateTime.now());

        return client;
    }

    public ClientDtoGet toGetDto(Client client) {

        return ClientDtoGet.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .dateOfBirth(client.getDateOfBirth())
                .membershipLevel(client.getMembershipLevel())
                .emergencyContact(client.getEmergencyContact())
                .createdAt(client.getCreatedAt())
                .appointments(appointmentMapper.toDtoGetList(client.getAppointments()))
                .build();
    }

    public List<ClientDtoGet> toGetDtoList(List<Client> clients) {
        return clients.stream().map(this::toGetDto).toList();
    }
}

