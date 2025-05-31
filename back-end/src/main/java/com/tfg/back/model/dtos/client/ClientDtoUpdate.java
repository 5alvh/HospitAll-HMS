package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.model.EmergencyContact;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public record ClientDtoUpdate(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Pattern(regexp = "^\\+?[0-9\\-\\s()]*$", message = "Invalid phone number format")
        String phoneNumber,

        LocalDate dateOfBirth,

        MembershipLevel membershipLevel,

        EmergencyContact emergencyContact,

        String address,

        BloodType bloodType

) {}
