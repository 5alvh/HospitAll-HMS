package com.tfg.back.configuration.servicesSecurity;

import com.tfg.back.model.LabResult;
import com.tfg.back.model.User;
import com.tfg.back.service.LabResultsService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("labResultsSecurityService")
public class LabResultSecurityService {


    private final LabResultsService labResultService;

    public LabResultSecurityService(LabResultsService labResultService) {
        this.labResultService = labResultService;
    }

    public boolean isPrescriber(Long id, Authentication authentication) {
        User doctor = (User) authentication.getPrincipal();

        LabResult labResult = labResultService.getLabResult(id);

        if (labResult.getOrderedBy().getId().equals(doctor.getId())) return true;
        return false;
    }
}
