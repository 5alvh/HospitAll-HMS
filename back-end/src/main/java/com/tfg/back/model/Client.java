package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "clients", indexes = {
        @Index(name = "idx_client_membership", columnList = "membershipLevel")
})
@DiscriminatorValue("CLIENT")
@PrimaryKeyJoinColumn(name = "client_id")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Client extends User {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MembershipLevel membershipLevel;

    @Embedded
    private EmergencyContact emergencyContact;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

    private BloodType bloodType;

    @OneToMany(mappedBy = "prescribedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MedicalPrescription> prescriptionsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LabResult> labResultsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedBack> feedbacksWritten = new ArrayList<>();
}

