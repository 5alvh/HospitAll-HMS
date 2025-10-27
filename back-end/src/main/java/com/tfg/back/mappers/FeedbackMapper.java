package com.tfg.back.mappers;

import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.FeedBack;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

public class FeedbackMapper {

    public static FeedBack toEntity(FeedbackDtoCreate feedbackDtoCreate, Client author, Doctor writtenTo) {
        Objects.requireNonNull(feedbackDtoCreate, "Feedback DTO cannot be null");
        Objects.requireNonNull(author, "Client cannot be null");
        return FeedBack.builder()
                .comment(feedbackDtoCreate.comment())
                .rating(feedbackDtoCreate.rating())
                .author(author)
                .writtenTo(writtenTo)
                .createdAt(LocalDateTime.now())
                .type(feedbackDtoCreate.type())
                .build();
    }
    public static FeedBackDtoGet toFeedBackDtoGet(FeedBack feedback) {
        Objects.requireNonNull(feedback, "Feedback cannot be null");
        return FeedBackDtoGet.builder()
                .id(feedback.getId())
                .comment(feedback.getComment())
                .rating(feedback.getRating())
                .createdAt(feedback.getCreatedAt())
                .patientName(feedback.getAuthor().getFullName())
                .doctorName(feedback.getWrittenTo() == null ? "404" : feedback.getWrittenTo().getFullName())
                .type(feedback.getType())
                .build();
    }

    public static List<FeedBackDtoGet> toFeedBackDtoGetList(List<FeedBack> feedbacksWritten) {
        return feedbacksWritten.stream()
                .map(FeedbackMapper::toFeedBackDtoGet)
                .toList();
    }
}
