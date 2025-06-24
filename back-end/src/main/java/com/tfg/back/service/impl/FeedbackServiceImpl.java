package com.tfg.back.service.impl;

import com.tfg.back.enums.FeedBackType;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.feedback.FeedbackNotFoundException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.FeedbackMapper;
import com.tfg.back.model.Client;
import com.tfg.back.model.Doctor;
import com.tfg.back.model.FeedBack;
import com.tfg.back.model.User;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;
import com.tfg.back.repository.ClientRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.repository.FeedbackRepository;
import com.tfg.back.service.ClientServiceLookUp;
import com.tfg.back.service.DoctorServiceLookUp;
import com.tfg.back.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ClientServiceLookUp clientService;
    private final DoctorServiceLookUp doctorService;

    @Override
    public List<FeedBackDtoGet> findMyFeedbacks(User patient) {
        List<FeedBack> feedbacks = feedbackRepository.findByAuthorId(patient.getId());
        return FeedbackMapper.toFeedBackDtoGetList(feedbacks);
    }

    @Override
    public FeedBackDtoGet writeFeedback(User patient, FeedbackDtoCreate feedbackDtoCreate) {

        Client author = clientService.findClientById(patient.getId());
        Doctor writtenTo;
        if (!(feedbackDtoCreate.type() == FeedBackType.GENERAL)) {
            writtenTo = doctorService.findDoctorById(feedbackDtoCreate.writtenToId());
        }else{
            writtenTo = null;
        }

        FeedBack fb = FeedbackMapper.toEntity(feedbackDtoCreate, author, writtenTo);
        FeedBack savedFeedback = feedbackRepository.save(fb);

        return FeedbackMapper.toFeedBackDtoGet(savedFeedback);
    }

    @Override
    public void deleteFeedback(Long id) {
        FeedBack feedback = feedbackRepository.findById(id)
                .orElseThrow(()-> new FeedbackNotFoundException("Feedback with ID: "+id+" is not found"));
        feedbackRepository.delete(feedback);
    }
}
