package com.tfg.back.service;

import com.tfg.back.model.Doctor;
import com.tfg.back.model.TimeInterval;
import com.tfg.back.model.dtos.doctor.AvailableDoctorGet;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;
import com.tfg.back.model.dtos.doctor.DoctorDtoGet;
import com.tfg.back.model.dtos.doctor.VisitedDoctorGet;

import java.time.LocalDate;
import java.util.List;

public interface DoctorService {
    DoctorDtoGet createDoctor(DoctorDtoCreate dto);
    DoctorDtoGet getDoctor(Long id);
    DoctorDtoGet getDoctorByEmail(String email);
    List<DoctorDtoGet> getAllDoctors();
    void deleteDoctor(Long id);
    Doctor findDoctorByEmail(String email);

    List<AvailableDoctorGet> getAvailableDoctors(Long departmentId, LocalDate date);
    List<TimeInterval> getAvailableSlots(Long doctorId, LocalDate date);
    List <VisitedDoctorGet> getDoctorsClientVisited(Long id);

}
