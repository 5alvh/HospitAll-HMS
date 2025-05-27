package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.AppointmentStatus;
import com.tfg.back.enums.AppointmentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments",
        indexes = {
                @Index(name = "idx_appointment_date", columnList = "appointmentDateTime"),
                @Index(name = "idx_appointment_status", columnList = "status")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnore
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    private LocalDateTime appointmentDateTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AppointmentType type = AppointmentType.IN_PERSON;

    private String reason;

    @Column(length = 500)
    private String diagnosis;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;


    public boolean isUpcoming() {
        return appointmentDateTime.isAfter(LocalDateTime.now()) &&
                (status == AppointmentStatus.SCHEDULED || status == AppointmentStatus.CONFIRMED);
    }

    public boolean canBeCancelled() {
        return status == AppointmentStatus.SCHEDULED || status == AppointmentStatus.CONFIRMED;
    }

    public boolean isScheduled() {
        return status == AppointmentStatus.SCHEDULED;
    }

}