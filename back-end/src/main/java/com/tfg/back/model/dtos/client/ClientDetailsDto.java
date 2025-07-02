package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.enums.UserStatus;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDetailsDto {

    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private UserStatus status;
    private String address;
    private MembershipLevel membershipLevel;
    private EmergencyContact emergencyContact;
    private BloodType bloodType;
    private List<AppointmentDtoGet> appointments;
    private List<MedicalPrescriptionDtoGet> prescriptionsReceived;
    private List<LabResultDtoGet> labResultsReceived;

}
