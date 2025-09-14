package com.logan.concert.beans;

import org.hibernate.Session;

import com.logan.concert.HibernateUtil;
import com.logan.concert.model.Band;
import com.logan.concert.model.Concert;
import com.logan.concert.model.Ticket;

import javax.enterprise.context.RequestScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;

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

}