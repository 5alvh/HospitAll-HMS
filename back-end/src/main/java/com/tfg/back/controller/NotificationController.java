package com.tfg.back.controller;

import static com.tfg.back.constants.BaseRoutes.*;

import com.tfg.back.model.Notification;
import com.tfg.back.model.User;
import com.tfg.back.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(NOTIFICATION)
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/my")
    public ResponseEntity<Page<Notification>> getMyNotifications(@AuthenticationPrincipal User patient, @RequestParam(defaultValue = "0") int size, @RequestParam(defaultValue = "10") int page) {
        Page<Notification> notifications = notificationService.findAppointmentsByClientId(patient, PageRequest.of(page, size, Sort.by("date").descending()));
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal User patient, @PathVariable Long id) {
        notificationService.markNotificationAsSeen(id, patient);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unseen/count")
    public ResponseEntity<Long> getUnseenNotificationsCount(@AuthenticationPrincipal User patient) {
        Long count = notificationService.countUnseenNotifications(patient);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/top-three")
    public ResponseEntity<List<Notification>> getTopThreeNotifications(@AuthenticationPrincipal User patient) {
        List<Notification> notifications = notificationService.getTopThreeNotifications(patient);
        return ResponseEntity.ok(notifications);
    }

}
