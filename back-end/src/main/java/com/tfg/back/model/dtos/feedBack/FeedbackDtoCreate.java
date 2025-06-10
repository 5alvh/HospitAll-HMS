package com.tfg.back.model.dtos.feedBack;

import com.tfg.back.enums.FeedBackType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public record FeedbackDtoCreate(String comment,
        int rating,
        Long writtenToId,
        FeedBackType type) {
}
