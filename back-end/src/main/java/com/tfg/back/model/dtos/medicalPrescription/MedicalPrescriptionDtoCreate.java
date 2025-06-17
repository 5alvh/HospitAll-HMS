package com.tfg.back.model.dtos.medicalPrescription;


import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.enums.SearchType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;


public record MedicalPrescriptionDtoCreate(Medication[] medications, String clientEmail, UUID clientId,

     SearchType searchType, String appointmentId, PrescriptionStatus status)
{}
