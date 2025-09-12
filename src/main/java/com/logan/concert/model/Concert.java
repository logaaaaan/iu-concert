package com.logan.concert.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Data
@Entity
@Table(name = "concert")
public class Concert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int concertId;

    @ManyToOne
    @JoinColumn(name = "bandId", nullable = false)
    private Band band;

    @ManyToOne
    @JoinColumn(name = "venueId", nullable = false)
    private Venue venue;

    private Time duration;

    private Date concertDate;

    private Time concertTime;

    private float price;

    private float vipPrice;
}