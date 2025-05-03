package com.tfg.back.model.dtos.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDtoUpdate {
    private String name;
    private String description;
    private String contactNumber;
    private String location;
    private String headDoctorEmail;
}
