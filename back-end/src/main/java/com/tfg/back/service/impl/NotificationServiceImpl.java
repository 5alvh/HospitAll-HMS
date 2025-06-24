package com.tfg.back.service.impl;

import com.tfg.back.enums.NotificationType;
import com.tfg.back.exceptions.notification.NotificationNotFoundException;
import com.tfg.back.model.Notification;
import com.tfg.back.model.User;
import com.tfg.back.repository.NotificationRepository;
import com.tfg.back.service.ClientServiceLookUp;
import com.tfg.back.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final ClientServiceLookUp clientService;

    public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate, NotificationRepository notificationRepository, ClientServiceLookUp clientService) {
        this.messagingTemplate = messagingTemplate;
        this.notificationRepository = notificationRepository;
        this.clientService = clientService;
    }

    @Override
    public List<Notification> findAppointmentsByClientId(User patient) {
        List<Notification> notifications = notificationRepository.findByUserId(patient.getId());
        return notifications;
    }

    @PreAuthorize("notificationSecurityService.canMarkNotificationAsSeen(#id, #authentication)")
    @Override
    public void markNotificationAsSeen(Long id, User patient) {

        Notification notification = getNotificationById(id);
        notification.setSeen(true);
        notificationRepository.save(notification);

    }

    @Override
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(()-> new NotificationNotFoundException("Notification with ID: "+id+" is not found"));
    }

    @Override
    public Long countUnseenNotifications(User patient) {
        return notificationRepository.countByUserIdAndSeenFalse(patient.getId());
    }

    @Override
    public List<Notification> getTopThreeNotifications(User patient) {
        return notificationRepository.findTop3ByUserIdAndSeenFalseOrderByDateDesc(patient.getId());
    }

    @Override
    public void createNotification(User to, String title, String message, NotificationType type) {

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(String.valueOf(type));
        notification.setSeen(false);
        notification.setDate(LocalDateTime.now());
        notification.setUser(to);
        notificationRepository.save(notification);

        Map<String, Object> notificationPayload = new HashMap<>();
        notificationPayload.put("id", notification.getId());
        notificationPayload.put("title", title);
        notificationPayload.put("message", message);
        notificationPayload.put("type", type.toString());
        notificationPayload.put("timestamp", notification.getDate());

        try {
            messagingTemplate.convertAndSendToUser(
                    to.getId().toString(),
                    "/queue/notifications",
                    notificationPayload
            );
        } catch (Exception e) {
            System.err.println("Failed to send real-time notification: " + e.getMessage());
        }
    }
}
