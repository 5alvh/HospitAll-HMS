package com.tfg.back.service.impl;

import com.tfg.back.enums.NotificationType;
import com.tfg.back.exceptions.labResult.LabResultNotFoundException;
import com.tfg.back.mappers.LabResultMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.labResults.LabResultDtoCreate;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;
import com.tfg.back.repository.LabResultsRepository;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabResultsServiceImpl implements LabResultsService {

    private final LabResultsRepository labResultRepository;
    private final NotificationRepository notificationRepository;
    private final DoctorServiceLookUp doctorService;
    private final ClientServiceLookUp clientService;
    private final LabResultMapper labResultMapper;
    private final NotificationService notificationService;

    @Autowired
    public LabResultsServiceImpl(LabResultsRepository labResultRepository, NotificationRepository notificationRepository, DoctorServiceLookUp doctorService, ClientServiceLookUp clientService, LabResultMapper labResultMapper, NotificationService notificationService) {
        this.labResultRepository = labResultRepository;
        this.notificationRepository = notificationRepository;
        this.doctorService = doctorService;
        this.clientService = clientService;
        this.labResultMapper = labResultMapper;
        this.notificationService = notificationService;
    }

    @Override
    public LabResultDtoGet findLabResultById(Long id) {
        return labResultMapper.toDtoGet(getLabResult(id));
    }

    @Override
    public Page<LabResultDtoGet> findLabResultsByPatientId(User patient, Pageable pageable) {
        Page<LabResultDtoGet> labResults = labResultRepository.findByPatientId(patient.getId(), pageable)
                .map(labResultMapper::toDtoGet);
        return labResults;
    }

    @Override
    public LabResultDtoGet createLabResult(LabResultDtoCreate labResult, User prescribedBy) {
        Client client = clientService.findClientById(labResult.getPatientId());
        Doctor doctor = doctorService.findDoctorById(prescribedBy.getId());
        LabResult labResultEntity = labResultMapper.toEntity(labResult, doctor, client);
        notificationService.createNotification(client,"New Lab Result" , "You have a new lab result", NotificationType.LAB_RESULT);
        return labResultMapper.toDtoGet(labResultRepository.save(labResultEntity));
    }


    @PreAuthorize("labResultsSecurityService.isPrescriber(#id, #authentication)")
    @Override
    public void deleteLabResult(Long id) {
        LabResult result = getLabResult(id);
        labResultRepository.delete(result);
    }

    @PreAuthorize("labResultsSecurityService.isPrescriber(#id, #authentication)")
    @Override
    public LabResult updateLabResult(Long id, LabResultDtoCreate updatedResult) {
        //TODO:
        return null;
    }

    @Override
    public LabResult getLabResult(Long id) {
        return  labResultRepository.findById(id)
                .orElseThrow(()-> new LabResultNotFoundException("Lab Result with ID: "+id+" is not found"));
    }
}
