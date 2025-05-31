package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.PrescriptionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_prescriptions", indexes = {
        @Index(name = "idx_prescription_start_date", columnList = "startDate"),
        @Index(name = "idx_prescription_end_date", columnList = "endDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalPrescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Medication name is required")
    @Column(nullable = false, length = 100)
    private String medicationName;

    @NotBlank(message = "Dosage is required")
    @Column(nullable = false, length = 50)
    private String dosage; // e.g., "500mg"

    @NotBlank(message = "Frequency is required")
    @Column(nullable = false, length = 50)
    private String frequency; // e.g., "Twice a day"

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Size(max = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescribed_by_id", nullable = false)
    @JsonIgnore
    private Doctor prescribedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescribed_to_id", nullable = false)
    @JsonIgnore
    private Client prescribedTo;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrescriptionStatus status;
}
