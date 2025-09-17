package com.logan.concert.beans;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.logan.concert.HibernateUtil;
import com.logan.concert.model.Billing;
import com.logan.concert.model.Concert;
import com.logan.concert.model.Ticket;

import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;

@ManagedBean
@RequestScoped
public class PaymentBean {
    // Billing information
    private int concertId;
    private String firstName;
    private String lastName;
    private String email;
    private String street;
    private String houseNumber;
    private String zipCode;
    private String city;
    private String paymentMethod = "paypal"; // Default payment method
    
    // Payment method specific fields
    private String iban;
    private String bic;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    
    // Ticket information from booking
    private int ticketQuantity;
    private String ticketType;
    private String ticketTypeName;
    private float pricePerTicket;
    private float total;
    private String ticketHoldersData; // JSON string from form
    
    @PostConstruct
    public void init() {
        // First try to get concertId from request parameter
        String concertIdParam = FacesContext.getCurrentInstance()
            .getExternalContext()
            .getRequestParameterMap()
            .get("concertId");
        
        if (concertIdParam != null) {
            try {
                this.concertId = Integer.parseInt(concertIdParam);
            } catch (NumberFormatException e) {
                System.err.println("Invalid concertId: " + concertIdParam);
            }
        }
    }

    // Getters and setters for all fields
    public int getConcertId() {
        return concertId;
    }

    public void setConcertId(int concertId) {
        this.concertId = concertId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getStreet() {
        return street;
    }
    
    public void setStreet(String street) {
        this.street = street;
    }
    
    public String getHouseNumber() {
        return houseNumber;
    }
    
    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getIban() {
        return iban;
    }
    
    public void setIban(String iban) {
        this.iban = iban;
    }
    
    public String getBic() {
        return bic;
    }
    
    public void setBic(String bic) {
        this.bic = bic;
    }
    
    public String getCardNumber() {
        return cardNumber;
    }
    
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public String getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public String getCvv() {
        return cvv;
    }
    
    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
    
    public int getTicketQuantity() {
        return ticketQuantity;
    }
    
    public void setTicketQuantity(int ticketQuantity) {
        this.ticketQuantity = ticketQuantity;
    }
    
    public String getTicketType() {
        return ticketType;
    }
    
    public void setTicketType(String ticketType) {
        this.ticketType = ticketType;
    }
    
    public String getTicketTypeName() {
        return ticketTypeName;
    }
    
    public void setTicketTypeName(String ticketTypeName) {
        this.ticketTypeName = ticketTypeName;
    }
    
    public float getPricePerTicket() {
        return pricePerTicket;
    }
    
    public void setPricePerTicket(float pricePerTicket) {
        this.pricePerTicket = pricePerTicket;
    }
    
    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }
    
    public float getTotalPrice() {
        return ticketQuantity * pricePerTicket;
    }
    
    public String getTicketHoldersData() {
        return ticketHoldersData;
    }
    
    public void setTicketHoldersData(String ticketHoldersData) {
        this.ticketHoldersData = ticketHoldersData;
    }
    
    public String submit() {
        try {
            System.out.println("=== PAYMENT BEAN SUBMIT CALLED ===");
            
            // Booking data aus localStorage lesen (von JavaScript)
            String bookingDataJson = FacesContext.getCurrentInstance()
                .getExternalContext()
                .getRequestParameterMap()
                .get("bookingData");
            
            if (bookingDataJson != null && !bookingDataJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode bookingData = mapper.readTree(bookingDataJson);
                
                int quantity = bookingData.get("quantity").asInt();
                String ticketType = bookingData.get("ticketType").asText();
                
                // Sold tickets updaten
                BookingBean bookingBean = new BookingBean();
                bookingBean.setConcertId(concertId); // ConcertId setzen
                bookingBean.updateSoldTickets(ticketType, quantity);
                
                System.out.println("Updated sold tickets: " + quantity + " x " + ticketType);
            }
            
            // Weiterleitung zur Bestätigungsseite
            return "/final_screen.xhtml?faces-redirect=true";

        } catch (Exception e) {
            e.printStackTrace();
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Fehler beim verarbeiten der Daten", null));
            return null;
        }
    }

}