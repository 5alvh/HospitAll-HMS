package com.tfg.back.repository;

import com.tfg.back.model.Department;
import com.tfg.back.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT d FROM Doctor d JOIN d.workingHours wh WHERE d.department = :dept AND wh.dayOfWeek = :day")
    List<Doctor> findByDepartmentAndWorkingHoursDay(@Param("dept") Department dept, @Param("day") DayOfWeek day);

}
