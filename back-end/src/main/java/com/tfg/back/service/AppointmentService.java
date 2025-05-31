package com.tfg.back.service;

import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import com.tfg.back.model.dtos.appointment.AppointmentCreateDto;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.appointment.BookAppointmentByDoctorRequest;
import com.tfg.back.model.dtos.appointment.DiagnosisRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDtoGet> getAllAppointments();
    AppointmentDtoGet getAppointmentById(Long id);
    void deleteAppointment(Long id);
    void cancelAppointment(Long id, String email);
    void confirmAppointment(Long id, String email);
    void completeAppointment(Long id, String email);
    AppointmentDtoGet bookAppointment(Long doctorId, LocalDate date, LocalTime startTime, String email, AppointmentType type, String reason, AppointmentStatus status);

    AppointmentDtoGet addDiagnosis(DiagnosisRequest request);

    Long getTotalPatients(Long id);

    AppointmentDtoGet bookAppointmentByDoctorUsingClientEmail(BookAppointmentByDoctorRequest request, String email);

    AppointmentDtoGet bookAppointmentByDoctorUsingClientId(BookAppointmentByDoctorRequest request, String email);

}

