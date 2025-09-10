package com.shweit.cinema.beans;

import com.shweit.cinema.HibernateUtil;
import com.shweit.cinema.model.Concert;
// import java.io.IOException;
import org.hibernate.Session;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
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
}