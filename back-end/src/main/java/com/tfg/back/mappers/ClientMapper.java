package com.tfg.back.mappers;

import com.tfg.back.enums.UserStatus;
import com.tfg.back.model.Client;
import com.tfg.back.model.dtos.client.ClientDtoCreate;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class ClientMapper {

    public static Client toEntity(ClientDtoCreate dto) {
        if (dto == null) {
            return null;
        }

        Client client = new Client();

        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setHashedPassword(dto.getHashedPassword());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setDateOfBirth(dto.getDateOfBirth());

        client.setStatus(UserStatus.ACTIVE);
        client.setCreatedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        client.setMembershipLevel(dto.getMembershipLevel());
        client.setEmergencyContact(dto.getEmergencyContact());

        client.setAppointments(new ArrayList<>());

        return client;
    }
}

