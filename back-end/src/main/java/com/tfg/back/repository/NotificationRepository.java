package com.tfg.back.repository;

import com.tfg.back.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndSeenFalse(Long userId);
}