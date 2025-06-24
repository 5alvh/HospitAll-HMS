package com.tfg.back.service.impl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Doctor;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.DoctorServiceLookUp;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DoctorServiceLookUpImpl implements DoctorServiceLookUp {

    private final DoctorRepository doctorRepository;

    public DoctorServiceLookUpImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor findDoctorById(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));
    }
}
