package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentCityValidator")
public class PaymentCityValidator implements Validator {
    private static final String CITY_PATTERN = "^[A-Za-zäöüÄÖÜß\\s.-]+$";
    
    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Die Stadt ist ein Pflichtfeld.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        String city = value.toString().trim();
        if (!city.matches(CITY_PATTERN)) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Stadtname darf nur Buchstaben, Leerzeichen, Punkte und Bindestriche enthalten.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        if (city.length() < 2 || city.length() > 50) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Der Stadtname muss zwischen 2 und 50 Zeichen lang sein.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}