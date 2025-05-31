package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.model.EmergencyContact;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ClientDtoCreate(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotNull(message = "Password confirmation is required")
        String passwordConfirmation,

        @Pattern(regexp = "^\\+?[0-9\\-\\s()]*$", message = "Invalid phone number format")
        String phoneNumber,

        LocalDate dateOfBirth,

        MembershipLevel membershipLevel,

        EmergencyContact emergencyContact,

        String address,

        BloodType bloodType

) {}
