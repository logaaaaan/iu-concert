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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.sql.Date;


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


    public List<Concert> getConcertsThisMonth() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            LocalDate now = LocalDate.now();
            LocalDate startOfMonth = now.withDayOfMonth(1);
            LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
            
            String hql = "FROM Concert c WHERE c.concertDate BETWEEN :startDate AND :endDate ORDER BY c.concertDate ASC";
            Query query = session.createQuery(hql);
            query.setParameter("startDate", Date.valueOf(startOfMonth));
            query.setParameter("endDate", Date.valueOf(endOfMonth));
            
            @SuppressWarnings("unchecked")
            List<Concert> concerts = query.list();
            return concerts;
        } finally {
            session.close();
        }
    }

    public List<Concert> getConcertsNextMonth() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            LocalDate now = LocalDate.now();
            LocalDate nextMonth = now.plusMonths(1);
            LocalDate startOfNextMonth = nextMonth.withDayOfMonth(1);
            LocalDate endOfNextMonth = nextMonth.withDayOfMonth(nextMonth.lengthOfMonth());
            
            String hql = "FROM Concert c WHERE c.concertDate BETWEEN :startDate AND :endDate ORDER BY c.concertDate ASC";
            Query query = session.createQuery(hql);
            query.setParameter("startDate", Date.valueOf(startOfNextMonth));
            query.setParameter("endDate", Date.valueOf(endOfNextMonth));
            
            @SuppressWarnings("unchecked")
            List<Concert> concerts = query.list();
            return concerts;
        } finally {
            session.close();
        }
    }

    public String getBandName(Concert concert) {
        return concert != null && concert.getBand() != null ? 
               concert.getBand().getBandName() : "Unbekannte Band";
    }
    
    public String getVenueName(Concert concert) {
        return concert != null && concert.getVenue() != null ? 
               concert.getVenue().getName() : "Unbekannter Ort";
    }

    public List<String> getGenres(Concert concert) {
        if (concert == null || concert.getBand() == null) {
            return new ArrayList<>();
        }
        Band band = concert.getBand();
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

    // Methode zur Prozentberechnung
    public double getSoldPercentage(Concert concert) {
        if (concert == null || concert.getVenue() == null) return 0;
        
        int totalCapacity = concert.getVenue().getStandingArea() + 
                        concert.getVenue().getSeatingArea() + 
                        concert.getVenue().getVipArea();
        
        int totalSold = concert.getStandingSeatsSold() + 
                    concert.getSeatingSeatsSold() + 
                    concert.getVipSeatsSold();
        
        if (totalCapacity == 0) return 0;
        
        // Float-Berechnung verwenden für kleine Prozente
        double percentage = (totalSold * 100.0f) / totalCapacity;
        return Math.round(percentage * 100.0) / 100.0; // Rundet auf ganze Prozent
    }

    // Methode für Verfügbarkeitstext
    public String getAvailabilityText(int percentage) {
        if (percentage >= 85) return "Fast ausverkauft! Sehr wenige Tickets verfügbar";
        if (percentage >= 65) return "Begrenzte Verfügbarkeit - Jetzt schnell sein!";
        if (percentage >= 40) return "Gute Verfügbarkeit - Sichere dir dein Ticket";
        return "Viele Tickets verfügbar - Gute Auswahl";
    }

    // Methode zur Extraktion der Highlights aus JSON
    public List<String> getHighlightsList(Concert concert) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(concert.getHighlights(), new TypeReference<List<String>>(){});
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}