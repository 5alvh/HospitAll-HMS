package com.tfg.back.model.dtos.doctor;

import com.tfg.back.annotations.ListSize;
import com.tfg.back.enums.Specialization;
import com.tfg.back.model.WorkingHours;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDtoCreate {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String hashedPassword;

    @NotNull(message = "Password confirmation is required")
    private String passwordConfirmation;


    @Pattern(regexp = "^\\+?[0-9\\-\\s()]*$", message = "Invalid phone number format")
    private String phoneNumber;

    private LocalDate dateOfBirth;

    @NotBlank(message = "Medical license number is required")
    private String medicalLicenseNumber;


    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Specialization specialization;

    @ListSize(value = 7, message = "Working hours must be provided for all 7 days of the week")
    private Set<WorkingHours> workingHours;

    private String address;
}
