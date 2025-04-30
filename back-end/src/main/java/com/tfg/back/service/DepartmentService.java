package com.tfg.back.service;

import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentCreateDto;

import java.util.List;

public interface DepartmentService {
    void createDepartment(DepartmentCreateDto departmentCreateDto);
    Department findByName(String name);
    List<Department> findAll();
    void deleteById(Long id);
    Department findById(Long id);
}
