package com.tfg.back.model.dtos.department;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDtoCreate {

    private String name;
    private String description;
    private String contactNumber;
    private String location;

}
