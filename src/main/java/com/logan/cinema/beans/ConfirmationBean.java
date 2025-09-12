package com.logan.cinema.beans;

import org.hibernate.Session;

import com.logan.cinema.HibernateUtil;
import com.logan.cinema.model.Ticket;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.List;

@ManagedBean
@RequestScoped
@SuppressWarnings("unchecked")
public class ConfirmationBean {
    private int billingId;

    @PostConstruct
    public void init() {
        // Get billingId from request parameter if available
        String billingIdParam = FacesContext.getCurrentInstance()
                .getExternalContext()
                .getRequestParameterMap()
                .get("billingId");

        if (billingIdParam != null && !billingIdParam.isEmpty()) {
            try {
                this.billingId = Integer.parseInt(billingIdParam);
            } catch (NumberFormatException e) {
                // Handle invalid billingId
                System.err.println("Invalid billingId: " + billingIdParam);
            }
        }
    }

    public List<Ticket> getTickets() {
        Session session = HibernateUtil.getSessionFactory().openSession();

        List<Ticket> tickets;
        try {
            String hql = "SELECT t FROM Ticket t " +
             "LEFT JOIN FETCH t.concert c " +
             "LEFT JOIN FETCH c.band " +
             "LEFT JOIN FETCH c.venue " +
             "WHERE t.billing.billingId = :billingId";

            tickets = session.createQuery(hql)
                .setParameter("billingId", billingId)
                .list();

        } catch (Exception e) {
            System.err.println("Error fetching tickets: " + e.getMessage());
            return new ArrayList<>();
        }

        session.close();
        System.out.println("Tickets: " + tickets);
        return tickets;
    }
}