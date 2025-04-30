package com.tfg.back.service.serviceImpl;

import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.doctors.DoctorDtoCreate;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.DoctorService;
import com.tfg.back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor createDoctor(DoctorDtoCreate doctor) {
        Doctor newDoctor = new Doctor();
        //to implement tomorrow

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
