package com.shweit.cinema.beans;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shweit.cinema.HibernateUtil;
import com.shweit.cinema.model.Band;
import com.shweit.cinema.model.Concert;
// import java.io.IOException;
import org.hibernate.Session;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@ManagedBean
@RequestScoped
@SuppressWarnings("unchecked")
public class ConcertBean {

    public List<Concert> getAllConcerts() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();

        List<Concert> concerts = session.createCriteria(Concert.class).list();

        session.getTransaction().commit();
        session.close();

        return concerts;
    }
    
    // Get band name for a concert
    public String getBandName(Concert concert) {
        return concert != null && concert.getBand() != null ? 
               concert.getBand().getBandName() : "Unbekannte Band";
    }
    
    // Get venue name for a concert
    public String getVenueName(Concert concert) {
        return concert != null && concert.getVenue() != null ? 
               concert.getVenue().getName() : "Unbekannter Ort";
    }

    // In ConcertBean.java
    public List<String> getGenres(Concert concert) {
        if (concert == null || concert.getBand() == null) {
            return new ArrayList<>();
        }
        Band band = concert.getBand();
        // Verwende die gleiche Logik wie in BandBean
        if (band.getGenre() == null || band.getGenre().isEmpty()) {
            return new ArrayList<>();
        }
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(band.getGenre(), new TypeReference<List<String>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}