package com.tfg.back.model.dtos.appointment;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateDto {

    @NotNull(message = "Client is required")
    private String clientEmail;

    @NotNull(message = "Doctor is required")
    private String doctorEmail;

    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDateTime;

    @Size(max = 500, message = "Reason must be less than 500 characters")
    private String reason;

}
