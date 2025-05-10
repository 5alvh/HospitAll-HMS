package com.tfg.back.mappers;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.service.ClientService;
import com.tfg.back.service.DoctorService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@AllArgsConstructor
public class AppointmentMapper {

    private final ClientService clientService;
    private final DoctorService doctorService;

    public Appointment toEntity(AppointmentCreateDto dto, String email) {
        Client client = clientService.getClientByEmail(email);
        Doctor doctor = doctorService.getDoctorByEmail(dto.getDoctorEmail());

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

    public AppointmentDtoGet toDtoGet(Appointment appointment) {
        return AppointmentDtoGet.builder()
                .id(appointment.getId())
                .clientFullName(appointment.getClient().getFullName())
                .doctorFullName(appointment.getDoctor().getFullName())
                .reason(appointment.getReason())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus())
                .type(appointment.getType())
                .build();
    }

    public List<AppointmentDtoGet> toDtoGetList(List<Appointment> appointments) {
        return appointments.stream().map(this::toDtoGet).toList();
    }
}
