package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.Specialization;
import com.tfg.back.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Specialization specialization;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WorkingHours> workingHours = new HashSet<>();

    @OneToMany(mappedBy = "prescribedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MedicalPrescription> prescriptionsGiven = new ArrayList<>();

    @OneToMany(mappedBy = "orderedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LabResult> labResultsGiven = new ArrayList<>();

    @OneToMany(mappedBy = "writtenTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedBack> feedbacksReceived = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_DOCTOR"));
    }

    @Override
    public String getPassword() {
        return super.getHashedPassword();
    }

    @Override
    public String getUsername() {
        return super.getId().toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return super.getStatus() == UserStatus.ACTIVE;
    }
}
