package com.logan.concert.beans;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logan.concert.HibernateUtil;
import com.logan.concert.model.Band;
import com.logan.concert.model.Concert;

// import java.io.IOException;
import org.hibernate.Session;
import org.hibernate.Query;
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
        try {
            String hql = "FROM Concert c ORDER BY c.concertDate ASC";
            Query query = session.createQuery(hql);
            @SuppressWarnings("unchecked")
            List<Concert> concerts = query.list();
            return concerts;
        } finally {
            session.close();
        }
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

    public String getGenresAsString(Concert concert) {
    if (concert == null || concert.getBand() == null) {
        return "";
    }
    
    Band band = concert.getBand();
    if (band.getGenre() == null || band.getGenre().isEmpty()) {
        return "";
    }
    
    ObjectMapper mapper = new ObjectMapper();
    try {
        List<String> genreList = mapper.readValue(band.getGenre(), new TypeReference<List<String>>() {});
        return String.join(", ", genreList);
    } catch (IOException e) {
        e.printStackTrace();
        return "";
    }
}
}