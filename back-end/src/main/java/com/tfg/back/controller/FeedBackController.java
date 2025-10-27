package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;

import com.tfg.back.model.User;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoUpdate;
import com.tfg.back.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(FEEDBACK)
@AllArgsConstructor
public class FeedBackController {

    private final FeedbackService feedbackService;


    @GetMapping("/by-id/{id}")
    public ResponseEntity<FeedBackDtoGet> getFeedBackById(@PathVariable Long id){
        FeedBackDtoGet feedback = feedbackService.getFeedBackById(id);
        return ResponseEntity.status(200).body(feedback);
    }

    @PutMapping("/edit-feedback/{id}")
    public ResponseEntity<FeedBackDtoGet> editFeedbackById(@PathVariable Long id, @RequestBody FeedbackDtoUpdate feedbackDtoUpdate){
        FeedBackDtoGet feedback = feedbackService.editFeedback(id, feedbackDtoUpdate);
        return ResponseEntity.status(200).body(feedback);
    }
    @GetMapping("/my")
    public ResponseEntity<List<FeedBackDtoGet>> getFeedBacksByPatient(@AuthenticationPrincipal User patient){
        List<FeedBackDtoGet> feedbacks = feedbackService.findMyFeedbacks(patient);
        return ResponseEntity.ok(feedbacks);
    }
    @GetMapping("/doctor/my")
    public ResponseEntity<List<FeedBackDtoGet>> getFeedBacksByDoctor(@AuthenticationPrincipal User doctor){
        List<FeedBackDtoGet> feedbacks = feedbackService.findMyFeedbacksByDoctor(doctor);
        return ResponseEntity.ok(feedbacks);
    }
    @PostMapping("/create")
    public ResponseEntity<FeedBackDtoGet> create(@RequestBody FeedbackDtoCreate feedbackDtoCreate, @AuthenticationPrincipal User patient) {
        FeedBackDtoGet saved = feedbackService.writeFeedback(patient, feedbackDtoCreate);
        return ResponseEntity.ok(saved);
    }

    //check if it's the same user with a feedbacksecurityservice
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
