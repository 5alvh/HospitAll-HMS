package com.tfg.back.model.dtos.feedBack;

import com.tfg.back.enums.FeedBackType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedBackDtoGet {
    private Long id;
    private String comment;
    private int rating;
    private LocalDateTime createdAt;
    private String patientName;
    private FeedBackType type;
    private String doctorName;
}
