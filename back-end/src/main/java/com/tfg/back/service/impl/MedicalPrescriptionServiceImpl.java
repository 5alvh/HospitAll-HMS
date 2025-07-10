package com.tfg.back.service.impl;

import com.tfg.back.constants.ResponseMessages;
import com.tfg.back.enums.NotificationType;
import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.MedicalPrescriptionMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoUpdate;
import com.tfg.back.model.dtos.medicalPrescription.Medication;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import com.tfg.back.service.ClientServiceLookUp;
import com.tfg.back.service.DoctorServiceLookUp;
import com.tfg.back.service.MedicalPrescriptionService;
import com.tfg.back.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class MedicalPrescriptionServiceImpl implements MedicalPrescriptionService {

    private final MedicalPrescriptionRepository medicalPrescriptionRepository;
    private final DoctorServiceLookUp doctorService;
    private final ClientServiceLookUp clientService;
    private final MedicalPrescriptionMapper medicalPrescriptionmapper;
    private final NotificationService notificationService;

    public MedicalPrescriptionServiceImpl(MedicalPrescriptionRepository medicalPrescriptionRepository, DoctorServiceLookUp doctorService, ClientServiceLookUp clientService, MedicalPrescriptionMapper medicalPrescriptionmapper, NotificationService notificationService) {
        this.medicalPrescriptionRepository = medicalPrescriptionRepository;
        this.doctorService = doctorService;
        this.clientService = clientService;
        this.medicalPrescriptionmapper = medicalPrescriptionmapper;
        this.notificationService = notificationService;
    }

    @PreAuthorize("medicalPrescriptionSecurityService.isPrescriberOrPatient(#id, #authentication)")
    @Override
    public MedicalPrescriptionDtoGet findPrescriptionById(Long id, User user) {
        MedicalPrescription prescription = findById(id);
        return medicalPrescriptionmapper.toDtoGet(prescription);
    }

    @Override
    public Page<MedicalPrescriptionDtoGet> findPrescriptionsByPatientId(User user,String search, Pageable pageable) {
        return medicalPrescriptionRepository.findByPrescribedToId(user.getId(), search, pageable)
                .map(medicalPrescriptionmapper::toDtoGet);
    }

    @Override
    public Page<MedicalPrescriptionDtoGet> findPrescriptionsByDoctorId(User user, String search,Pageable pageable) {
        return medicalPrescriptionRepository.findByPrescribedById(user.getId(), search, pageable)
                .map(medicalPrescriptionmapper::toDtoGet);

    }

    @Override
    public Boolean createPrescription(MedicalPrescriptionDtoCreate dtoCreate, User prescribedBy) {


        Client client = clientService.findClientById(dtoCreate.clientId());


        Doctor doctor = doctorService.findDoctorById(prescribedBy.getId());
        PrescriptionStatus status = dtoCreate.status();
        for (Medication medication : dtoCreate.medications()) {
            MedicalPrescription prescriptionEntity = medicalPrescriptionmapper.toEntity(status,medication, doctor, client);
            MedicalPrescription prescriptionSaved = medicalPrescriptionRepository.save(prescriptionEntity);
            notificationService.createNotification(client, "New Prescription", "You have a new prescription", NotificationType.MEDICAL_PRESCRIPTION);
            if (prescriptionSaved == null) return false;
        }
        return true;
    }

    @PreAuthorize("medicalPrescriptionSecurityService.isSamePrescriber(#id, #authentication)")
    @Override
    public void deletePrescription(Long id, User doctor) {
        MedicalPrescription prescription = findById(id);
        medicalPrescriptionRepository.delete(prescription);
    }

    @Override
    public Boolean publishPrescription(Long id, User doctor) {
        MedicalPrescription prescription = findById(id);
        prescription.setStatus(PrescriptionStatus.PUBLISHED);
        MedicalPrescription prescriptionSaved = medicalPrescriptionRepository.save(prescription);
        return prescriptionSaved != null;
    }

    @PreAuthorize("@medicalPrescriptionSecurityService.isSamePrescriber(#dto.id(), #authentication)")
    @Override
    public MedicalPrescriptionDtoGet updatePrescription(MedicalPrescriptionDtoUpdate dto, User doctor) {

        Client client = clientService.findByEmail(dto.prescribedEmail());
        MedicalPrescription prescription = findById(dto.id());

        prescription.setFrequency(dto.frequency());
        prescription.setMedicationName(dto.medicationName());
        prescription.setDosage(dto.dosage());
        prescription.setStartDate(dto.startDate());
        prescription.setEndDate(dto.startDate().plusDays(dto.duration()));
        prescription.setPrescribedTo(client);
        prescription.setNotes(dto.notes());
        MedicalPrescription prescriptionSaved = medicalPrescriptionRepository.save(prescription);
        return medicalPrescriptionmapper.toDtoGet(prescriptionSaved);
    }

    @Override
    public Long countPendingPrescriptionsByDoctorId(UUID uuid) {
        Long count = medicalPrescriptionRepository.countByPrescribedByIdAndStatus(uuid, PrescriptionStatus.DRAFT);
        System.out.println("The count: " + count);
        return count;
    }

    private MedicalPrescription findById(Long id) {
        return medicalPrescriptionRepository.findById(id)
                .orElseThrow(()-> new PrescriptionNotFoundException(ResponseMessages.Medical_Prescription_NOT_FOUND_WITH_ID));
    }

}
