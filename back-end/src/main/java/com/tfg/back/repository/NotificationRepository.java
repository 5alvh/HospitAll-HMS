package com.tfg.back.repository;

import com.tfg.back.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserId(UUID uuid, Pageable pageable);
    List<Notification> findTop3ByUserIdAndSeenFalseOrderByDateDesc(UUID id);
    Long countByUserIdAndSeenFalse(UUID email);
}