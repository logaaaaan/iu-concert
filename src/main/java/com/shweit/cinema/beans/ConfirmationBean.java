package com.shweit.cinema.beans;

import com.shweit.cinema.HibernateUtil;
import com.shweit.cinema.model.Ticket;
import org.hibernate.Session;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.List;

@ManagedBean
@RequestScoped
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
                // Handle invalid movieId
                System.err.println("Invalid billingId: " + billingIdParam);
            }
        }
    }

    public List<Ticket> getTickets() {
        Session session = HibernateUtil.getSessionFactory().openSession();

        List<Ticket> tickets;
        try {
            String hql = "FROM Ticket WHERE billingId = :billingId";
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
