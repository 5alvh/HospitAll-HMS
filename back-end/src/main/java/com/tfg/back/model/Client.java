package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.BloodType;
import com.tfg.back.enums.MembershipLevel;
import com.tfg.back.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
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

