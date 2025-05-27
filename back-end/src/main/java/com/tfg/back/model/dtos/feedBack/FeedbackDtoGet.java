package com.tfg.back.model.dtos.feedBack;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDtoGet {

    private Long id;
    private String comment;
    private int rating;
    private LocalDateTime createdAt;
    private String userFullName;
}
