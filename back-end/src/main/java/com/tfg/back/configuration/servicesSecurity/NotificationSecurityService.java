package com.tfg.back.configuration.servicesSecurity;


import com.tfg.back.model.Notification;
import com.tfg.back.model.User;
import com.tfg.back.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("notificationSecurityService")
public class NotificationSecurityService {

    private NotificationService notificationService;

    public NotificationSecurityService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public boolean canMarkNotificationAsSeen(Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID patientId = user.getId();

        Notification notification = notificationService.getNotificationById(id);
        if (notification.getUser().getId().equals(patientId)) return true;
        return false;
    }
}
