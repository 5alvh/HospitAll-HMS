package com.tfg.back.repository;

import com.tfg.back.model.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedBack, Long> {

    List<FeedBack> findByAuthorEmail(String email);
}
