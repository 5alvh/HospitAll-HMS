package com.tfg.back.model.dtos.doctor;


import java.util.UUID;

public record AvailableDoctorGet(String doctorFullName, UUID doctorId)
{}
