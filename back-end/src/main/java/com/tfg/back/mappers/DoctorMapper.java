package com.tfg.back.mappers;

import com.tfg.back.enums.UserStatus;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.doctor.DoctorDtoCreate;
import com.tfg.back.model.dtos.doctor.DoctorDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGetDoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DoctorMapper {

    private final PasswordEncoder passwordEncoder;
    private final AppointmentMapper appointmentMapper;
    private final MedicalPrescriptionMapper medicalPrescriptionMapper;

    @Autowired
    public DoctorMapper(PasswordEncoder passwordEncoder, AppointmentMapper appointmentMapper, MedicalPrescriptionMapper medicalPrescriptionMapper) {
        this.passwordEncoder = passwordEncoder;
        this.appointmentMapper = appointmentMapper;
        this.medicalPrescriptionMapper = medicalPrescriptionMapper;
    }


    public Doctor toEntity(DoctorDtoCreate dto, Department department) {
        if (dto == null) {
            return null;
        }

        Doctor doctor = new Doctor();

        doctor.setFullName(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setAddress(dto.getAddress());
        doctor.setHashedPassword(passwordEncoder.encode(dto.getHashedPassword()));
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setDateOfBirth(dto.getDateOfBirth());
        doctor.setStatus(UserStatus.ACTIVE);

        doctor.setMedicalLicenseNumber(dto.getMedicalLicenseNumber());
        doctor.setDepartment(department);
        doctor.setSpecialization(dto.getSpecialization());

        Set<WorkingHours> workingHoursSet = new HashSet<>();
        for (WorkingHours wh : dto.getWorkingHours()) {
            wh.setDoctor(doctor);  // Set reverse reference

            for (TimeInterval ti : wh.getTimeIntervals()) {
                ti.setWorkingHours(wh);  // Set reverse reference
            }

            workingHoursSet.add(wh);
        }

        doctor.setWorkingHours(workingHoursSet);

        return doctor;
    }

    public DoctorDtoGet toDtoGet(Doctor doctor) {
        if (doctor == null) {
            return null;
        }
        return DoctorDtoGet.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhoneNumber())
                .dateOfBirth(doctor.getDateOfBirth())
                .createdAt(doctor.getCreatedAt())
                .medicalLicenseNumber(doctor.getMedicalLicenseNumber())
                .department(doctor.getDepartment())
                .specialization(doctor.getSpecialization())
                .address(doctor.getAddress())
                .appointments(appointmentMapper.toDtoGetList(doctor.getAppointments()))
                .prescriptionsGiven(medicalPrescriptionMapper.toDtoGetList(doctor.getPrescriptionsGiven()))
                .workingHours(doctor.getWorkingHours())
                .feedbacksReceived(toFeedBackDtoGetDoc(doctor.getFeedbacksReceived()))
                .build();
    }

    public List<DoctorDtoGet> toDtoGetList(List<Doctor> doctors) {
        return doctors.stream().map(this::toDtoGet).toList();
    }

    private FeedBackDtoGetDoc toFeedBackDtoGetDoc(FeedBack feedBack) {
        return FeedBackDtoGetDoc.builder()
                .id(feedBack.getId())
                .comment(feedBack.getComment())
                .rating(feedBack.getRating())
                .createdAt(feedBack.getCreatedAt())
                .patientName(feedBack.getAuthor().getFullName())
                .build();
    }

    private List<FeedBackDtoGetDoc> toFeedBackDtoGetDoc(List<FeedBack> feedBacks) {
        return feedBacks.stream().map(this::toFeedBackDtoGetDoc).toList();
    }
}

