package com.tfg.back.mappers;

import com.tfg.back.enums.UserStatus;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class DoctorMapper {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DoctorMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }


    public Doctor toEntity(DoctorDtoCreate dto, Department department) {
        if (dto == null) {
            return null;
        }

        Doctor doctor = new Doctor();

        doctor.setFullName(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setHashedPassword(passwordEncoder.encode(dto.getHashedPassword()));
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setDateOfBirth(dto.getDateOfBirth());
        doctor.setStatus(UserStatus.ACTIVE);

        doctor.setMedicalLicenseNumber(dto.getMedicalLicenseNumber());
        doctor.setDepartment(department);
        doctor.setSpecialization(dto.getSpecialization());

        if (dto.getWorkingHours() != null) {
            doctor.setWorkingHours(new HashSet<>(dto.getWorkingHours()));
        }

        return doctor;
    }
}

