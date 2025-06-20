package com.tfg.back.service;

import com.tfg.back.exceptions.notification.NotificationNotFoundException;
import com.tfg.back.exceptions.user.UnauthorizedToPerformThisAction;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.model.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<Notification> getAllClientNotifications(UUID email);
    /**
     * Marks a specific notification as "seen" for an authorized client.
     * <p>
     * This method performs the following operations:
     * <ol>
     *   <li>Verifies the client exists by email</li>
     *   <li>Validates the requesting client is authorized to modify the notification</li>
     *   <li>Locates the notification by ID</li>
     *   <li>Updates the notification's seen status</li>
     *   <li>Persists the updated notification</li>
     * </ol>
     *
     * @param id The ID of the notification to mark as seen
     * @param email The email of the client requesting the action
     * @throws UserNotFoundException if no client exists with the specified email
     * @throws UnauthorizedToPerformThisAction if the requesting client is not authorized
     * @throws NotificationNotFoundException if no notification exists with the specified ID
     *
     * @security The client email must match the authenticated user's email
     * @stateTransition Changes notification.getSeen from false to true
     * @sideEffects Updates the notification entity in the database
     */
    void seenNotification(Long id, UUID email);
}
