package com.tfg.back.service;

import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.EmailRequest;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;

import java.util.List;

public interface DoctorService {
    Doctor createDoctor(DoctorDtoCreate dto);
    Doctor getDoctor(Long id);
    Doctor getDoctorByEmail(EmailRequest email);
    List<Doctor> getAllDoctors();
    boolean deleteDoctor(Long id);
}
