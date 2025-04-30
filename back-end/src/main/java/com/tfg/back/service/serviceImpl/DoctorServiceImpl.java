package com.tfg.back.service.serviceImpl;

import com.tfg.back.mappers.DoctorMapper;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.DepartmentService;
import com.tfg.back.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentService departmentService;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, DepartmentService departmentService) {
        this.doctorRepository = doctorRepository;
        this.departmentService = departmentService;
    }

    @Override
    public Doctor createDoctor(DoctorDtoCreate doctor) {
        Department department = departmentService.findById(doctor.getDepartmentId());
        Doctor newDoctor = DoctorMapper.toEntity(doctor, department);
        return doctorRepository.save(newDoctor);
    }

    @Override
    public Doctor getDoctor(Long id) {
        return doctorRepository.findById(id).get();
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
