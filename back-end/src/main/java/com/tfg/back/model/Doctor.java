package com.tfg.back.model;

import com.tfg.back.enums.Specialization;
import jakarta.persistence.*;
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

    @Column(unique = true, nullable = false, length = 50)
    private String medicalLicenseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Specialization specialization;


    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "doctor_working_hours", joinColumns = @JoinColumn(name = "doctor_id"))
    private Set<WorkingHours> workingHours = new HashSet<>();

}
