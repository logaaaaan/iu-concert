package com.logan.concert.beans;

import org.hibernate.Session;

import com.logan.concert.HibernateUtil;
import com.logan.concert.model.Band;
import com.logan.concert.model.Concert;
import com.logan.concert.model.Ticket;
import com.logan.concert.model.Venue;

import javax.enterprise.context.RequestScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
import org.hibernate.Transaction;  

@ManagedBean
@RequestScoped
public class BookingBean implements Serializable {
    private int concertId;
    private Concert concert;
    
    @PostConstruct
    public void init() {
        // Get concertId from request parameter if available
        String concertIdParam = FacesContext.getCurrentInstance()
            .getExternalContext()
            .getRequestParameterMap()
            .get("concertId");
        
        if (concertIdParam != null && !concertIdParam.isEmpty()) {
            try {
                this.concertId = Integer.parseInt(concertIdParam);
            } catch (NumberFormatException e) {
                System.err.println("Invalid concertId: " + concertIdParam);
                try {
                    FacesContext.getCurrentInstance().getExternalContext().redirect("index.xhtml");
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        } 
    }
    
    public String getConcertTime() {
        Session session = HibernateUtil.getSessionFactory().openSession();

        System.out.println("concertId: " + concertId);

        Concert concert = (Concert) session.get(Concert.class, concertId);
        if (concert == null) {
            return "";
        }

        return concert.getConcertTime() != null ? concert.getConcertTime().toString() : "";
    }

    public String getConcertName() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Concert concert = (Concert) session.get(Concert.class, concertId);

        return concert != null && concert.getBand() != null ? 
               concert.getBand().getBandName() : "Band nicht gefunden";
    }

    public Concert getConcert() {
        if (this.concert != null) {
            return this.concert;
        }

        Session session = HibernateUtil.getSessionFactory().openSession();
        this.concert = (Concert) session.get(Concert.class, concertId);

        return this.concert;
    }
    
    @SuppressWarnings("unchecked")
    public ArrayList<String> getBookedSeatsForConcert() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        ArrayList<String> bookedSeats = new ArrayList<>();

        try {
            String hql = "FROM Ticket t WHERE t.concert.concertId = :concertId";
            List<Ticket> tickets = session.createQuery(hql)
                .setParameter("concertId", concertId)
                .list();

            for (Ticket ticket : tickets) {
                if (ticket.getSeatNumber() != null) {
                    bookedSeats.add(ticket.getSeatNumber());
                }
            }
        } finally {
            session.close();
        }

        return bookedSeats;
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
        
        // Je nach Tickettyp die entsprechende Sold-Zahl erhöhen
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

public void setConcertId(int concertId) {
    this.concertId = concertId;
    this.concert = null; // Reset concert cache
}

public boolean isTicketTypeAvailable(String ticketType) {
    return getAvailableTickets(ticketType) > 0;

}
}