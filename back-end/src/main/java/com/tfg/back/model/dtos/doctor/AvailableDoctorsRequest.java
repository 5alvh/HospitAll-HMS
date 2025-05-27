package com.tfg.back.model.dtos.doctor;

import java.time.LocalDate;

public record AvailableDoctorsRequest(Long departmentId, LocalDate date) {
}
