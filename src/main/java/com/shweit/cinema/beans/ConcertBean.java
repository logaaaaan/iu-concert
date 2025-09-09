package com.shweit.cinema.beans;

import com.shweit.cinema.HibernateUtil;
import com.shweit.cinema.model.Concert;
import java.io.IOException;
import org.hibernate.Session;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;

@ManagedBean
@RequestScoped
public class ConcertBean {

    public List<Concert> getAllConcerts() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();

        List<Concert> concerts = session.createCriteria(Concert.class).list();

        session.getTransaction().commit();
        session.close();

        return concerts;
    }
    
    public List<String> getGenres(Concert concert) {
        // Null-Prüfung für das `concert`-Objekt und `concert.getGenre()`
        if (concert == null || concert.getGenre() == null || concert.getGenre().isEmpty()) {
            return new ArrayList<>(); // Leere Liste zurückgeben
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            // JSON-String in eine Liste von Strings konvertieren
            return mapper.readValue(concert.getGenre(), new TypeReference<List<String>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>(); // Leere Liste bei Fehler zurückgeben
        }
    }
    
    // Return a comma separated String with all support acts
    public String getSupportActs(Concert concert) {
        // Check if concert object or supportActs is null or empty
        if (concert == null || concert.getSupportActs() == null || concert.getSupportActs().isEmpty()) {
            return "";
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            // Convert JSON string to List of Strings
            List<String> actsList = mapper.readValue(concert.getSupportActs(), new TypeReference<List<String>>() {});
            // Join the support acts list with commas
            return String.join(", ", actsList);
        } catch (IOException e) {
            e.printStackTrace();
            return ""; // Return empty string in case of error
        }
    }
}