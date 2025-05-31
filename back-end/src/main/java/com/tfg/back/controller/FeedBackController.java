package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;
import com.tfg.back.model.dtos.feedBack.FeedBackDtoGet;
import com.tfg.back.model.dtos.feedBack.FeedbackDtoCreate;
import com.tfg.back.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(FEEDBACK)
@AllArgsConstructor
public class FeedBackController {

    private final FeedbackService feedbackService;

    @PostMapping("/create")
    public ResponseEntity<FeedBackDtoGet> sendFeedback(@RequestBody FeedbackDtoCreate feedbackDtoCreate, Authentication authentication) {
        String clientEmail = authentication.getName();
        FeedBackDtoGet saved = feedbackService.sendFeedback(clientEmail, feedbackDtoCreate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
