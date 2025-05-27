package com.tfg.back.model.dtos.appointment;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentDtoGet {

    private Long id;
    private String clientFullName;
    private String doctorFullName;
    private String reason;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private AppointmentType type;
    private String departmentName;
    private String diagnosis;
}
