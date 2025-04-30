package com.tfg.back.mappers;

import com.tfg.back.model.Department;
import com.tfg.back.model.dtos.department.DepartmentCreateDto;

public interface DepCreateToEntity {


    public static Department toEntity(DepartmentCreateDto dto) {
        if (dto == null) {
            return null;
        }
        Department department = new Department();

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setContactNumber(dto.getContactNumber());
        department.setLocation(dto.getLocation());

        return department;
    }
}
