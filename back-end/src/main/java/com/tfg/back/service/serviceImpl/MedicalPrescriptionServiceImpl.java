package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.PrescriptionStatus;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.MedicalPrescriptionMapper;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoCreate;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.Medication;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.MedicalPrescriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Slf4j
@Service
public class MedicalPrescriptionServiceImpl implements MedicalPrescriptionService {

    private final MedicalPrescriptionRepository medicalPrescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final ClientRepository clientRepository;
    private final MedicalPrescriptionMapper medicalPrescriptionmapper;
    private final NotificationRepository notificationRepository;

    public MedicalPrescriptionServiceImpl(MedicalPrescriptionRepository medicalPrescriptionRepository, DoctorRepository doctorRepository, ClientRepository clientRepository, MedicalPrescriptionMapper medicalPrescriptionmapper, NotificationRepository notificationRepository) {
        this.medicalPrescriptionRepository = medicalPrescriptionRepository;
        this.doctorRepository = doctorRepository;
        this.clientRepository = clientRepository;
        this.medicalPrescriptionmapper = medicalPrescriptionmapper;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public MedicalPrescriptionDtoGet getPrescriptionById(Long id, String getterEmail) {
        MedicalPrescription prescription = findByIdAndCheckDoctor(id, getterEmail);
        if(!Objects.equals(prescription.getPrescribedBy().getEmail(), getterEmail) && !Objects.equals(prescription.getPrescribedTo().getEmail(), getterEmail)) throw new UnauthorizedToPerformThisAction("You are not authorized to delete this prescription");
        return medicalPrescriptionmapper.toDtoGet(prescription);
    }

    @Override
    public Boolean createPrescription(MedicalPrescriptionDtoCreate dtoCreate, String creatorEmail) {

        if (dtoCreate.clientId() == null && dtoCreate.clientEmail() == null) throw new IllegalArgumentException("You must specify the client id or the client email");
        Client client = null;
        if (dtoCreate.searchType().equals(SearchType.EMAIL)){
             client = clientRepository.findByEmail(dtoCreate.clientEmail())
                    .orElseThrow(()-> new UserNotFoundException(dtoCreate.clientEmail(), SearchType.EMAIL));
        }

        if (dtoCreate.searchType().equals(SearchType.ID)){
             client = clientRepository.findById(dtoCreate.clientId())
                    .orElseThrow(()-> new UserNotFoundException(dtoCreate.clientId(), SearchType.ID));
        }

        if (client == null) throw new UserNotFoundException("NULL", dtoCreate.searchType());

        Doctor doctor = checkDoctor(creatorEmail);
        PrescriptionStatus status = dtoCreate.status();
        for (Medication medication : dtoCreate.medications()) {
            MedicalPrescription prescriptionEntity = medicalPrescriptionmapper.toEntity(status,medication, doctor, client);
            MedicalPrescription prescriptionSaved = medicalPrescriptionRepository.save(prescriptionEntity);
            createNotifications(prescriptionSaved);
            if (prescriptionSaved == null) return false;
        }
        return true;
    }

    @Override
    public void deletePrescription(Long id, String creatorEmail) {
        MedicalPrescription prescription = findByIdAndCheckDoctor(id, creatorEmail);
        if(!Objects.equals(prescription.getPrescribedBy().getEmail(), creatorEmail)) throw new UnauthorizedToPerformThisAction("You are not authorized to delete this prescription");
        medicalPrescriptionRepository.delete(prescription);
    }


    @Override
    public Boolean publishPrescription(Long id, String creatorEmail) {
        MedicalPrescription prescription = findByIdAndCheckDoctor(id, creatorEmail);
        prescription.setStatus(PrescriptionStatus.PUBLISHED);
        MedicalPrescription prescriptionSaved = medicalPrescriptionRepository.save(prescription);
        return prescriptionSaved != null;
    }

    private MedicalPrescription findByIdAndCheckDoctor(Long id, String creatorEmail) {
        Doctor doctor = checkDoctor(creatorEmail);
        return medicalPrescriptionRepository.findById(id)
                .orElseThrow(()-> new PrescriptionNotFoundException("Prescription not found"));
    }

    private Doctor checkDoctor(String creatorEmail) {
        return doctorRepository.findByEmail(creatorEmail)
                .orElseThrow(()-> new UserNotFoundException(creatorEmail, SearchType.EMAIL));
    }

    private void createNotifications(MedicalPrescription prescription) {
        Notification notification = new Notification();
        notification.setTitle(prescription.getMedicationName());
        notification.setMessage(prescription.getFrequency());
        notification.setType("MEDICAMENT");
        notification.setSeen(false);
        notification.setDate(LocalDateTime.now());
        notification.setUser(prescription.getPrescribedTo());
        notificationRepository.save(notification);
    }
}
