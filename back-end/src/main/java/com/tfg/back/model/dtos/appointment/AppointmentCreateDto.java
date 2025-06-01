package com.tfg.back.model.dtos.appointment;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "Appointment", description = "DTO for creating an appointment")
public class AppointmentCreateDto {


    @Schema(description = "Doctor email", example = "Hb2w7@example.com")
    @NotNull(message = "Doctor is required")
    private String doctorEmail;

    @Schema(description = "appointment date and time", example = "2023-01-01T10:00:00")
    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDateTime;

    @Schema(description = "Reason for the appointment", example = "I need to see a doctor")
    @Size(max = 500, message = "Reason must be less than 500 characters")
    private String reason;

}
