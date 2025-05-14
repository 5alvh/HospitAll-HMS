package com.tfg.back.controller;

import com.tfg.back.service.NotificationService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<?> markAsRead(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        notificationService.seenNotification(id, email);
        return ResponseEntity.ok().build();
    }
}
