package com.tfg.back.utils;

import java.time.LocalDate;

public record AvailableSlotsRequest(Long doctorId, LocalDate date) {
}
