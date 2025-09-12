package com.logan.cinema.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "venue")
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int venueId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int totalCapacity;

    private Integer standingArea;

    private Integer seatingArea;

    private Integer vipArea;
}