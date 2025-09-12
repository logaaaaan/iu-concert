package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentHouseNumberValidator")
public class PaymentHouseNumberValidator implements Validator {
    private static final String HOUSE_NUMBER_PATTERN = "^[0-9]+([-/][0-9]+)?[a-zA-Z]?$";
    
    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Die Hausnummer ist ein Pflichtfeld.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        String houseNumber = value.toString().trim();
        if (!houseNumber.matches(HOUSE_NUMBER_PATTERN)) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Bitte geben Sie eine gültige Hausnummer ein (z.B. 12, 12a, 12-14).");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        if (houseNumber.length() > 10) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Die Hausnummer darf nicht länger als 10 Zeichen sein.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}