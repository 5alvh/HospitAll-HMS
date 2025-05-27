package com.tfg.back.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tfg.back.enums.FeedBackType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedBack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private FeedBackType type;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    @JsonIgnore
    private Client author;

    @ManyToOne(optional = false)
    @JoinColumn(name = "written_to_id")
    @JsonIgnore
    private Doctor writtenTo;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
