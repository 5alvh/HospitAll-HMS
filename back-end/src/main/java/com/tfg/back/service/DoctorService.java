package com.tfg.back.service;

import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.doctors.DoctorDtoCreate;

import java.util.List;

public interface DoctorService {
    Doctor createDoctor(DoctorDtoCreate dto);
    Doctor getDoctor(Long id);
    List<Doctor> getAllDoctors();
    void deleteDoctor(Long id);
}
