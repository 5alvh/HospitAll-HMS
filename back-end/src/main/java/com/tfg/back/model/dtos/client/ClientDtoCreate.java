package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.model.EmergencyContact;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDtoCreate {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Password confirmation is required")
    private String passwordConfirmation;


    @Pattern(regexp = "^\\+?[0-9\\-\\s()]*$", message = "Invalid phone number format")
    private String phoneNumber;

    private LocalDate dateOfBirth;

    private MembershipLevel membershipLevel;

    private EmergencyContact emergencyContact;

}
