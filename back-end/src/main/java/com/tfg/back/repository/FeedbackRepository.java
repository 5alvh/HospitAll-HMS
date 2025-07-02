package com.tfg.back.repository;

import com.tfg.back.model.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedBack, Long> {

    List<FeedBack> findByAuthorId(UUID id);
    List<FeedBack> findByWrittenToId(UUID id);

    /*@Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.writtenTo.id = :doctorId")
    Double doctorAverageRating(@Param("doctorId") UUID doctorId);*/
    @Query("SELECT AVG(f.rating) FROM FeedBack f WHERE f.writtenTo.id = :doctorId")
    Double doctorAverageRating(@Param("doctorId") UUID doctorId);
}
