package com.logan.cinema.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "billing")
public class Billing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int billingId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false, length = 10)
    private String zip;

    @Column(nullable = false, length = 10)
    private String houseNumber;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 50)
    private String paymentInfo;

    @Column(columnDefinition = "JSON")
    private String transactionDetails;
}