package com.tfg.back.model.dtos.doctor;

import java.time.LocalDate;

public record AvailableSlotsRequest(Long doctorId, LocalDate date) {
}
