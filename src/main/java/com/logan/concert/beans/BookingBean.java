package com.logan.concert.beans;

import org.hibernate.Session;

import com.logan.concert.HibernateUtil;
import com.logan.concert.model.Band;
import com.logan.concert.model.Concert;
import com.logan.concert.model.Venue;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import java.io.Serializable;
import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import org.hibernate.Transaction;  

@ManagedBean
@ViewScoped
public class BookingBean implements Serializable {
    private int concertId;
    private Concert concert;
    
    @PostConstruct
    public void init() {
        // Get concertId from request parameter AND from viewParam
        String concertIdParam = getConcertIdFromRequest();
        
        if (concertIdParam != null && !concertIdParam.isEmpty()) {
            try {
                int newConcertId = Integer.parseInt(concertIdParam);
                if (this.concertId != newConcertId) {
                    this.concertId = newConcertId;
                    this.concert = null; // Cache zurücksetzen
                    System.out.println("BookingBean initialized with new concertId: " + this.concertId);
                }
            } catch (NumberFormatException e) {
                System.err.println("Invalid concertId: " + concertIdParam);
                try {
                    FacesContext.getCurrentInstance().getExternalContext().redirect("index.xhtml");
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        } else {
            System.err.println("No concertId parameter found");
        }
    }
    
    // Helper method to get concertId from various sources
    private String getConcertIdFromRequest() {
        FacesContext context = FacesContext.getCurrentInstance();
        
        // First try request parameter
        String concertIdParam = context.getExternalContext()
            .getRequestParameterMap()
            .get("concertId");
            
        if (concertIdParam != null && !concertIdParam.isEmpty()) {
            return concertIdParam;
        }
        
        // Then try view parameter (for f:viewParam)
        Map<String, Object> viewParams = context.getViewRoot().getViewMap();
        if (viewParams.containsKey("concertId")) {
            Object concertIdObj = viewParams.get("concertId");
            return concertIdObj != null ? concertIdObj.toString() : null;
        }
        
        return null;
    }
    
    // Method to manually set concertId (called from payment page if needed)
    public void setConcertId(int concertId) {
        if (this.concertId != concertId) {
            this.concertId = concertId;
            this.concert = null; // Reset concert cache
            System.out.println("ConcertId manually set to: " + concertId);
        }
    }
    
    public int getConcertId() {
        return concertId;
    }
    
    public String getConcertTime() {
        Concert concert = getConcert();
        return (concert != null && concert.getConcertTime() != null) ? 
               concert.getConcertTime().toString() : "";
    }

    public String getConcertName() {
        Concert concert = getConcert();
        return (concert != null && concert.getBand() != null) ? 
               concert.getBand().getBandName() : "Band nicht gefunden";
    }

    public Concert getConcert() {
        if (this.concert != null) {
            return this.concert;
        }

        if (concertId <= 0) {
            System.err.println("Invalid concertId: " + concertId);
            return null;
        }

        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            this.concert = (Concert) session.get(Concert.class, concertId);
            if (this.concert == null) {
                System.err.println("Concert not found for ID: " + concertId);
            }
        } finally {
            session.close();
        }

        return this.concert;
    }

    public Band getBand() {
        Concert concert = getConcert();
        return concert != null ? concert.getBand() : null;
    }

    public int getBookedTicketsCount() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String hql = "SELECT COUNT(*) FROM Ticket t WHERE t.concert.concertId = :concertId";
            Long count = (Long) session.createQuery(hql)
                .setParameter("concertId", concertId)
                .uniqueResult();
            return count != null ? count.intValue() : 0;
        } finally {
            session.close();
        }
    }

    public int getAvailableTickets(String ticketType) {
        Concert concert = getConcert();
        if (concert == null) return 0;
        
        Venue venue = concert.getVenue();
        int capacity = 0;
        int sold = 0;
        
        switch(ticketType) {
            case "standing":
                capacity = venue.getStandingArea() != null ? venue.getStandingArea() : 0;
                sold = concert.getStandingSeatsSold();
                break;
            case "seated":
                capacity = venue.getSeatingArea() != null ? venue.getSeatingArea() : 0;
                sold = concert.getSeatingSeatsSold();
                break;
            case "vip":
                capacity = venue.getVipArea() != null ? venue.getVipArea() : 0;
                sold = concert.getVipSeatsSold();
                break;
            default:
                capacity = 0;
        }
        
        return Math.max(0, capacity - sold);
    }

    public void updateSoldTickets(String ticketType, int quantity) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        
        try {
            transaction = session.beginTransaction();
            
            // Concert-Objekt neu laden
            Concert concert = (Concert) session.get(Concert.class, concertId);
            if (concert == null) {
                System.err.println("Concert not found with ID: " + concertId);
                return;
            }
            
            switch(ticketType) {
                case "standing":
                    concert.setStandingSeatsSold(concert.getStandingSeatsSold() + quantity);
                    break;
                case "seated":
                    concert.setSeatingSeatsSold(concert.getSeatingSeatsSold() + quantity);
                    break;
                case "vip":
                    concert.setVipSeatsSold(concert.getVipSeatsSold() + quantity);
                    break;
            }
            
            session.update(concert);
            transaction.commit();
            
            // Local cache aktualisieren
            this.concert = concert;
            
            System.out.println("Successfully updated sold tickets: " + quantity + " x " + ticketType);
            System.out.println("New standing sold: " + concert.getStandingSeatsSold());
            System.out.println("New seating sold: " + concert.getSeatingSeatsSold());
            System.out.println("New VIP sold: " + concert.getVipSeatsSold());
            
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.err.println("Error updating sold tickets: " + e.getMessage());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }

    public boolean isTicketTypeAvailable(String ticketType) {
        return getAvailableTickets(ticketType) > 0;
    }
}