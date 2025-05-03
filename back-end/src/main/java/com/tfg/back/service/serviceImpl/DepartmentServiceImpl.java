package com.tfg.back.service.serviceImpl;

import com.tfg.back.mappers.DepartmentMapper;
import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentCreateDto;
import com.tfg.back.repository.DepartmentRepository;
import com.tfg.back.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void createDepartment(DepartmentCreateDto createDto) {
        boolean exists = departmentRepository.existsByName(createDto.getName());
        if(exists){

        }
        Department dep = DepartmentMapper.toEntity(createDto);
        departmentRepository.save(dep);
    }

    @Override
    public Department findByName(String name) {
        return departmentRepository.findByName(name).get();
    }

    @Override
    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        departmentRepository.deleteById(id);
    }

    @Override
    public Department findById(Long id) {
        return departmentRepository.findById(id).get();
    }
}
