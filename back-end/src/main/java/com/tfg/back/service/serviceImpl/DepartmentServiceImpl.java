package com.tfg.back.service.serviceImpl;

import com.tfg.back.exceptions.department.DepartmentAlreadyExistsException;
import com.tfg.back.exceptions.department.DepartmentNotFoundException;
import com.tfg.back.mappers.DepartmentMapper;
import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.dtos.department.DepartmentDtoCreate;
import com.tfg.back.model.dtos.department.DepartmentDtoUpdate;
import com.tfg.back.repository.DepartmentRepository;
import com.tfg.back.service.DepartmentService;
import com.tfg.back.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorService doctorService;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository, DoctorService doctorService) {
        this.departmentRepository = departmentRepository;
        this.doctorService = doctorService;
    }

    @Override
    public Department createDepartment(DepartmentDtoCreate createDto) {
        boolean exists = departmentRepository.existsByName(createDto.getName());
        if(exists){
            throw new DepartmentAlreadyExistsException(createDto.getName());
        }
        Department dep = DepartmentMapper.toEntity(createDto);
        return departmentRepository.save(dep);
    }

    @Override
    public Department getDepartmentByName(String name) {
        return departmentRepository.findByName(name)
                .orElseThrow(()-> new DepartmentNotFoundException("department with name: "+name+" is not found"));
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(()-> new DepartmentNotFoundException("department with ID: "+id+" is not found"));
    }

    @Override
    public Department updateDepartment(Long id, DepartmentDtoUpdate departmentUpdateDto) {
        String email = departmentUpdateDto.getHeadDoctorEmail();
        Doctor doctor= null;
        if (email != null) {
            doctor = doctorService.getDoctorByEmail(email);
        }
        Department department = DepartmentMapper.updateEntity(getDepartmentById(id), departmentUpdateDto,doctor);
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.deleteById(id);
    }


}
