package com.tfg.back.model.dtos.doctor;

import java.time.LocalDate;
import java.util.UUID;

public record AvailableSlotsRequest(UUID doctorId, LocalDate date) {
}
