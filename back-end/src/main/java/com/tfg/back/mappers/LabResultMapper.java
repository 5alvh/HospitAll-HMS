package com.tfg.back.mappers;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.LabResult;
import com.tfg.back.model.dtos.LabResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.LabResults.LabResultDtoGet;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class LabResultMapper {

    public LabResult toEntity(LabResultDtoCreate dto, Doctor doctor, Client client) {
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
