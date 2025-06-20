package com.tfg.back.repository;

import com.tfg.back.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(UUID email);
    List<Notification> findTop3ByUserIdAndSeenFalseOrderByDateDesc(UUID email);
}