package com.tfg.back.controller;

import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;
import com.tfg.back.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
@AllArgsConstructor
public class FeedBackController {

    private final FeedbackService feedbackService;

    @PostMapping("/create")
    public ResponseEntity<Void> sendFeedback(@RequestBody FeedbackDtoCreate feedbackDtoCreate, Authentication authentication) {
        String clientEmail = authentication.getName();
        Boolean saved = feedbackService.sendFeedback(clientEmail, feedbackDtoCreate);
        if (saved){
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
