package com.tfg.back.mappers;

import com.tfg.back.enums.SearchType;
import com.tfg.back.enums.UserStatus;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Client;
import com.tfg.back.model.FeedBack;
import com.tfg.back.model.MedicalPrescription;
import com.tfg.back.model.Notification;
import com.tfg.back.model.dtos.client.ClientDtoCreate;
import com.tfg.back.model.dtos.client.ClientDtoGet;
import com.tfg.back.model.dtos.client.ClientDtoUpdate;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGetDoc;
import com.tfg.back.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class ClientMapper {

    private final PasswordEncoder passwordEncoder;
    private final AppointmentMapper appointmentMapper;
    private final MedicalPrescriptionMapper medicalPrescriptionMapper;
    private final LabResultMapper labResultMapper;

    @Autowired
    public ClientMapper(PasswordEncoder passwordEncoder, AppointmentMapper appointmentMapper, MedicalPrescriptionMapper medicalPrescriptionMapper, LabResultMapper labResultMapper) {
        this.passwordEncoder = passwordEncoder;
        this.appointmentMapper = appointmentMapper;
        this.medicalPrescriptionMapper = medicalPrescriptionMapper;
        this.labResultMapper = labResultMapper;
    }

    public Client toEntity(ClientDtoCreate dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Client is null");
        }

        Client client = new Client();

        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setAddress(dto.getAddress());
        client.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setDateOfBirth(dto.getDateOfBirth());
        client.setBloodType(dto.getBloodType());

        client.setStatus(UserStatus.ACTIVE);
        client.setCreatedAt(LocalDateTime.now());

        client.setMembershipLevel(dto.getMembershipLevel());
        client.setEmergencyContact(dto.getEmergencyContact());

        client.setAppointments(new ArrayList<>());
        return client;
    }

    public Client updateEntity(Client client, ClientDtoUpdate dto){
        if (dto == null){
            throw new IllegalArgumentException("ClientDtoUpdate is null");
        }

        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setDateOfBirth(dto.getDateOfBirth());
        client.setAddress(dto.getAddress());
        client.setStatus(UserStatus.ACTIVE);
        client.setBloodType(dto.getBloodType());

        client.setMembershipLevel(dto.getMembershipLevel());
        client.setEmergencyContact(dto.getEmergencyContact());

        client.setUpdatedAt(LocalDateTime.now());

        return client;
    }

    public ClientDtoGet toGetDto(Client client) {

        return ClientDtoGet.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .bloodType(client.getBloodType())
                .phoneNumber(client.getPhoneNumber())
                .dateOfBirth(client.getDateOfBirth())
                .membershipLevel(client.getMembershipLevel())
                .address(client.getAddress())
                .emergencyContact(client.getEmergencyContact())
                .createdAt(client.getCreatedAt())
                .appointments(appointmentMapper.toDtoGetList(client.getAppointments()))
                .prescriptions(medicalPrescriptionMapper.toDtoGetList(client.getPrescriptionsReceived()))
                .labResults(labResultMapper.toDtoGetList(client.getLabResultsReceived()))
                .notifications(client.getNotifications())
                .feedbacksWritten(toFeedBackDtoGetDocList(client.getFeedbacksWritten()))
                .build();
    }

    public List<ClientDtoGet> toGetDtoList(List<Client> clients) {
        return clients.stream().map(this::toGetDto).toList();
    }

    private FeedBackDtoGetDoc toFeedBackDtoGetDoc(FeedBack feedback) {
        return FeedBackDtoGetDoc.builder()
                .id(feedback.getId())
                .comment(feedback.getComment())
                .rating(feedback.getRating())
                .createdAt(feedback.getCreatedAt())
                .patientName(feedback.getAuthor().getFullName())
                .build();
    }

    private List<FeedBackDtoGetDoc> toFeedBackDtoGetDocList(List<FeedBack> feedbacksWritten) {
        return feedbacksWritten.stream().map(this::toFeedBackDtoGetDoc).toList();
    }

}

