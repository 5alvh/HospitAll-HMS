package com.tfg.back.model.dtos.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailableDoctorGet {
    private String doctorFullName;
    private Long doctorId;
}
