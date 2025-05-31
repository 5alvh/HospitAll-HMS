package com.tfg.back.mappers;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.LabResult;
import com.tfg.back.model.dtos.labResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Component
public class LabResultMapper {

    public LabResult toEntity(LabResultDtoCreate dto, Doctor doctor, Client client) {
        Objects.requireNonNull(dto, "Lab Result DTO cannot be null");
        Objects.requireNonNull(doctor, "Doctor cannot be null");
        Objects.requireNonNull(client, "Client cannot be null");
        return LabResult.builder()
                .testName(dto.getTestName())
                .resultValue(dto.getResultValue())
                .status(dto.getStatus())
                .unit(dto.getUnit())
                .referenceRange(dto.getReferenceRange())
                .resultDate(dto.getResultDate())
                .notes(dto.getNotes())
                .orderedBy(doctor)
                .patient(client)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public LabResultDtoGet toDtoGet(LabResult labResult) {
        Objects.requireNonNull(labResult, "Lab Result cannot be null");
        return LabResultDtoGet.builder()
                .id(labResult.getId())
                .testName(labResult.getTestName())
                .resultValue(labResult.getResultValue())
                .status(labResult.getStatus())
                .unit(labResult.getUnit())
                .referenceRange(labResult.getReferenceRange())
                .resultDate(labResult.getResultDate())
                .notes(labResult.getNotes())
                .createdAt(labResult.getCreatedAt())
                .updatedAt(labResult.getUpdatedAt())
                .version(labResult.getVersion())
                .doctorFullName(labResult.getOrderedBy().getFullName())
                .patientFullName(labResult.getPatient().getFullName())
                .build();
    }

    public List<LabResultDtoGet> toDtoGetList(List<LabResult> labResults) {return labResults.stream().map(this::toDtoGet).toList();}
}
