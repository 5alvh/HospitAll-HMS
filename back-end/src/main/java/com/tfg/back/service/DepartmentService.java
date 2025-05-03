package com.tfg.back.service;

import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentDtoCreate;
import com.tfg.back.model.dtos.department.DepartmentDtoUpdate;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(DepartmentDtoCreate departmentDtoCreate);
    Department getDepartmentByName(String name);
    List<Department> getAllDepartments();
    void deleteById(Long id);
    Department getDepartmentById(Long id);
    Department updateDepartment(Long id, DepartmentDtoUpdate departmentUpdateDto);
}
