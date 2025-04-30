package com.tfg.back.mappers;

import com.tfg.back.enums.UserStatus;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;

import java.util.HashSet;

public class DoctorMapper {

    public static Doctor toEntity(DoctorDtoCreate dto, Department department) {
        if (dto == null) {
            return null;
        }

        Doctor doctor = new Doctor();

        // Inherited from User
        doctor.setFullName(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setHashedPassword(dto.getHashedPassword());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setDateOfBirth(dto.getDateOfBirth());
        doctor.setStatus(UserStatus.ACTIVE);

        // Doctor-specific
        doctor.setMedicalLicenseNumber(dto.getMedicalLicenseNumber());
        doctor.setDepartment(department);
        doctor.setSpecialization(dto.getSpecialization());

        if (dto.getWorkingHours() != null) {
            doctor.setWorkingHours(new HashSet<>(dto.getWorkingHours()));
        }

        return doctor;
    }
}

