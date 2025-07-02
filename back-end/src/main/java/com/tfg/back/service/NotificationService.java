package com.tfg.back.service;

import com.tfg.back.enums.NotificationType;
import com.tfg.back.exceptions.notification.NotificationNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Notification;
import com.tfg.back.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    Page<Notification> findAppointmentsByClientId(User patient, Pageable pageable);

    void markNotificationAsSeen(Long id, User patient);

    void createNotification(User to, String title, String message, NotificationType type);

    Notification getNotificationById(Long id);

    Long countUnseenNotifications(User patient);

    List<Notification> getTopThreeNotifications(User patient);

}
