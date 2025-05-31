package com.tfg.back.model.dtos.medicalPrescription;



import java.time.LocalDate;

public record MedicalPrescriptionDtoUpdate (Long id, String medicationName, String dosage,
                                            String frequency,
                                            LocalDate startDate,
                                            Long duration,
                                            String notes,
                                            Long prescribedToId){
}
