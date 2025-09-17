package com.logan.concert.beans;

import org.hibernate.Session;

import com.logan.concert.HibernateUtil;
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

}