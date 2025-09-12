package com.logan.cinema.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentStreetValidator")
public class PaymentStreetValidator implements Validator {
    private static final String STREET_PATTERN = "^[A-Za-zäöüÄÖÜß\\s.-]+$";
    
    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Die Straße ist ein Pflichtfeld.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        String street = value.toString().trim();
        if (!street.matches(STREET_PATTERN)) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Straßenname darf nur Buchstaben, Leerzeichen, Punkte und Bindestriche enthalten.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        if (street.length() < 2 || street.length() > 50) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Straßenname muss zwischen 2 und 50 Zeichen lang sein.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}