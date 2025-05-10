package com.tfg.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Date;

@Entity
@Table(name = "time_intervals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimeInterval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIME)
    private LocalTime startTime;

    @Temporal(TemporalType.TIME)
    private LocalTime  endTime;

    @ManyToOne
    @JoinColumn(name = "working_hours_id")
    @JsonIgnore
    private WorkingHours workingHours;
}