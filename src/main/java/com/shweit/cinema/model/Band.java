package com.shweit.cinema.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "band")
public class Band {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bandId;

    @Column(nullable = false)
    private String bandName;

    private String cover;

    @Column(name = "short_desc", columnDefinition = "TEXT")
    private String shortDesc;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String genre;
}
