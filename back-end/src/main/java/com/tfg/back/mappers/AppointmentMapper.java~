package com.tfg.back.mappers;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.EmailRequest;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.ClientService;
import com.tfg.back.service.DoctorService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class AppointmentMapper {

    private final ClientService clientService;
    private final DoctorRepository doctorRep;

    public Appointment toEntity(AppointmentCreateDto dto) {
        Client client = clientService.getClientByEmail(dto.getClientEmail());
        Doctor doctor = doctorRep.findByEmail(dto.getDoctorEmail())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with email: " + dto.getDoctorEmail()));

        Department department = doctor.getDepartment();

        return Appointment.builder()
                .client(client)
                .doctor(doctor)
                .department(department)
                .appointmentDateTime(dto.getAppointmentDateTime())
                .reason(dto.getReason())
                .status(AppointmentStatus.SCHEDULED)
                .type(AppointmentType.IN_PERSON)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
