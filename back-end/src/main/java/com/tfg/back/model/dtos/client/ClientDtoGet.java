package com.tfg.back.model.dtos.client;

import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.model.EmergencyContact;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.labResults.LabResultDtoGet;
import com.tfg.back.model.dtos.appointment.AppointmentDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.medicalPrescription.MedicalPrescriptionDtoGet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDtoGet {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private MembershipLevel membershipLevel;
    private EmergencyContact emergencyContact;
    private LocalDateTime createdAt;
    private List<AppointmentDtoGet> appointments;
    private String address;
    private BloodType bloodType;
    private List<Notification> notifications;
    private List<MedicalPrescriptionDtoGet> prescriptions;
    private List<LabResultDtoGet> labResults;
    private List<FeedBackDtoGet> feedbacksWritten;
}
