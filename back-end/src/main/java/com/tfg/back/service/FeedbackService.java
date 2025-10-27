package com.tfg.back.service;

import com.tfg.back.exceptions.feedback.FeedbackNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoUpdate;

import java.util.List;
import java.util.UUID;

public interface FeedbackService {
    List<FeedBackDtoGet>  findMyFeedbacks(User patient);
    List<FeedBackDtoGet>  findMyFeedbacksByDoctor(User doctor);
    FeedBackDtoGet getFeedBackById(Long feedbackId);
    FeedBackDtoGet writeFeedback(User patient, FeedbackDtoCreate feedbackDtoCreate);
    FeedBackDtoGet editFeedback(Long id, FeedbackDtoUpdate feedbackDtoUpdate);
    void deleteFeedback(Long id);

    Double averageRating(UUID doctorId);
}
