package com.tfg.back.mappers;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class MedicalPrescriptionMapper {

    public MedicalPrescriptionDtoGet toDtoGet(MedicalPrescription prescription) {
        return MedicalPrescriptionDtoGet.builder()
                .id(prescription.getId())
                .medicationName(prescription.getMedicationName())
                .dosage(prescription.getDosage())
                .frequency(prescription.getFrequency())
                .startDate(prescription.getStartDate())
                .endDate(prescription.getEndDate())
                .notes(prescription.getNotes())
                .prescribedBy(prescription.getPrescribedBy().getFullName())
                .createdAt(prescription.getCreatedAt())
                .prescribedTo(prescription.getPrescribedTo().getFullName())
                .clientEmail(prescription.getPrescribedTo().getEmail())
                .isPublished(false)
                .build();

    }

    public List<MedicalPrescriptionDtoGet> toDtoGetList(List<MedicalPrescription> prescriptions) {
        return prescriptions.stream().map(this::toDtoGet).toList();
    }

    public MedicalPrescription toEntity(MedicalPrescriptionDtoCreate dto, Doctor doctor, Client client) {
        return MedicalPrescription.builder()
                .medicationName(dto.getMedicationName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .notes(dto.getNotes())
                .prescribedBy(doctor)
                .prescribedTo(client)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
