package com.tfg.back.service;

import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;

public interface FeedbackService {

    Boolean sendFeedback(String clientEmail,FeedbackDtoCreate feedbackDtoCreate);
    void deleteFeedback(Long id);

}
