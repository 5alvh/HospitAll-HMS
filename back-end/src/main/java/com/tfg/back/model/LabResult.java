package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "lab_results", indexes = {
        @Index(name = "idx_lab_result_date", columnList = "resultDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Test name is required")
    @Column(nullable = false, length = 100)
    private String testName;

    @NotBlank(message = "Result value is required")
    @Column(nullable = false, length = 100)
    private String resultValue;

    @Column(length = 100)
    private String unit; // Optional: e.g., "mg/dL", "mmol/L"

    @Column(length = 100)
    private String referenceRange; // Optional: e.g., "70-110 mg/dL"

    @NotNull(message = "Result date is required")
    private LocalDate resultDate;

    @Size(max = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordered_by_id", nullable = false)
    @JsonIgnore
    private Doctor orderedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Client patient;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    private String status;
}
