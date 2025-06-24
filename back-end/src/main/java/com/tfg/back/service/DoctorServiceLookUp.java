package com.tfg.back.service;

import com.tfg.back.model.Doctor;

import java.util.UUID;

public interface DoctorServiceLookUp {
    Doctor findDoctorById(UUID id);
}
