package com.tfg.back.mappers;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.model.Appointment;
import com.tfg.back.model.Client;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.service.ClientService;
import com.tfg.back.service.DoctorService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component

public class AppointmentMapper {

    private final ClientService clientService;
    private final DoctorService doctorService;

    public Appointment toEntity(AppointmentCreateDto dto) {
        Client client = clientService.getClientByEmail(dto.getClientEmail());
        Doctor doctor = doctorService.getDoctorByEmail(dto.getDoctorEmail()); // or findByEmail()

        Department department = doctor.getDepartment(); // assuming doctor has department

        Appointment appointment = new Appointment();
        return Appointment.builder()
                .client(client)
                .doctor(doctor)
                .department(department)
                .appointmentDateTime(dto.getAppointmentDateTime())
                .reason(dto.getReason())
                .status(AppointmentStatus.SCHEDULED)
                .type(AppointmentType.IN_PERSON)
                .build();
    }
}
