package com.tfg.back.service;

import com.tfg.back.exceptions.feedback.FeedbackNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;

import java.util.List;
import java.util.UUID;

public interface FeedbackService {
    List<FeedBackDtoGet>  findMyFeedbacks(User patient);

    FeedBackDtoGet writeFeedback(User patient, FeedbackDtoCreate feedbackDtoCreate);

    void deleteFeedback(Long id);

}
