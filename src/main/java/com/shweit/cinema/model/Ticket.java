package com.shweit.cinema.model;

import lombok.Data;
import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ticketId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    private String concertTime;

    private String seatNumber;

    @Column(nullable = false, length = 50)
    private String ticketType;

    @Column(nullable = false)
    private String ticketNumber;

    @Column(nullable = false)
    private float price;

    @Column(nullable = false)
    private Timestamp purchaseDate;

    @ManyToOne
    @JoinColumn(name = "concertId", nullable = false)
    private Concert concert;

    @ManyToOne
    @JoinColumn(name = "billingId", nullable = false)
    private Billing billing;
}