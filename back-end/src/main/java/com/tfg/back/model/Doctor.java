package com.tfg.back.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "doctors", indexes = {
        @Index(name = "idx_doctor_specialization", columnList = "specialization"),
        @Index(name = "idx_doctor_license", columnList = "medicalLicenseNumber")
})
@DiscriminatorValue("DOCTOR")
@PrimaryKeyJoinColumn(name = "doctor_id")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Doctor extends User {

    @NotBlank(message = "Medical license number is required")
    @Column(unique = true, nullable = false, length = 50)
    private String medicalLicenseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Specialization specialization;

    @Temporal(TemporalType.DATE)
    @Column(name = "license_expiration_date")
    private Date licenseExpiration;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "doctor_working_hours", joinColumns = @JoinColumn(name = "doctor_id"))
    private Set<WorkingHours> workingHours = new HashSet<>();

    public enum Specialization {
        CARDIOLOGY, NEUROLOGY, PEDIATRICS, ONCOLOGY, ORTHOPEDICS
    }
}
