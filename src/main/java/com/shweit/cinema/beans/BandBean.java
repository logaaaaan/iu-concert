package com.shweit.cinema.beans;

import com.shweit.cinema.HibernateUtil;
import com.shweit.cinema.model.Band;
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
@SuppressWarnings("unchecked")
public class BandBean {

    public List<Band> getAllBands() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();

        List<Band> bands = session.createCriteria(Band.class).list();

        session.getTransaction().commit();
        session.close();

        return bands;
    }
    
    public List<String> getGenres(Band band) {
        // Null-Prüfung für das `band`-Objekt und `band.getGenre()`
        if (band == null || band.getGenre() == null || band.getGenre().isEmpty()) {
            return new ArrayList<>(); // Leere Liste zurückgeben
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            // JSON-String in eine Liste von Strings konvertieren
            return mapper.readValue(band.getGenre(), new TypeReference<List<String>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>(); // Leere Liste bei Fehler zurückgeben
        }
    }
    
    // Return a comma separated String with all genres
    public String getGenresAsString(Band band) {
        // Check if band object or genre is null or empty
        if (band == null || band.getGenre() == null || band.getGenre().isEmpty()) {
            return "";
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            // Convert JSON string to List of Strings
            List<String> genreList = mapper.readValue(band.getGenre(), new TypeReference<List<String>>() {});
            // Join the genre list with commas
            return String.join(", ", genreList);
        } catch (IOException e) {
            e.printStackTrace();
            return ""; // Return empty string in case of error
        }
    }
    
    // Get band name for a Band object
    public String getBandName(Band band) {
        return band != null ? band.getBandName() : "Unbekannte Band";
    }
}