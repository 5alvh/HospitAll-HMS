package com.tfg.back.configuration.servicesSecurity;

import com.tfg.back.constants.ResponseMessages;
import com.tfg.back.exceptions.medicalPrescription.PrescriptionNotFoundException;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.model.User;
import com.tfg.back.repository.MedicalPrescriptionRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("medicalPrescriptionSecurityService")
public class MedicalPrescriptionSecurityService {

    private final MedicalPrescriptionRepository medicalPrescriptionRepository;

    public MedicalPrescriptionSecurityService(MedicalPrescriptionRepository medicalPrescriptionRepository) {
        this.medicalPrescriptionRepository = medicalPrescriptionRepository;
    }

    public boolean isPrescriberOrPatient(Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID getterId = user.getId();

        MedicalPrescription mp = medicalPrescriptionRepository.findById(id)
                .orElseThrow(()-> new PrescriptionNotFoundException(ResponseMessages.Medical_Prescription_NOT_FOUND_WITH_ID));

        return mp.getPrescribedBy().getId().equals(getterId) || mp.getPrescribedTo().getId().equals(getterId);
    }

    public boolean isSamePrescriber(Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID getterId = user.getId();

        MedicalPrescription mp = medicalPrescriptionRepository.findById(id)
                .orElseThrow(()-> new PrescriptionNotFoundException(ResponseMessages.Medical_Prescription_NOT_FOUND_WITH_ID));

        return mp.getPrescribedBy().getId().equals(getterId);
    }
}
