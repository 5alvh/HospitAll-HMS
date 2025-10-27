package com.tfg.back.model.dtos.feedBack;

import com.tfg.back.enums.FeedBackType;

import java.util.UUID;

public record FeedbackDtoUpdate(
        String comment,
        int rating,
        UUID writtenToId,
        FeedBackType type
) {
}
