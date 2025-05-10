package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.EmergencyContact;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDtoGet {

    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private MembershipLevel membershipLevel;
    private EmergencyContact emergencyContact;
    private LocalDateTime createdAt;
    private List<Appointment> appointments;
}
