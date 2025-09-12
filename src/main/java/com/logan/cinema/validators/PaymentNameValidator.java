package com.logan.cinema.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentNameValidator")
public class PaymentNameValidator implements Validator {
    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || !value.toString().matches("^[A-Za-zäöüÄÖÜß\\s-]+$")) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Name darf nur Buchstaben, Leerzeichen und Bindestriche enthalten.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        String name = value.toString().trim();
        if (name.length() < 2 || name.length() > 50) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Name muss zwischen 2 und 50 Zeichen lang sein.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}