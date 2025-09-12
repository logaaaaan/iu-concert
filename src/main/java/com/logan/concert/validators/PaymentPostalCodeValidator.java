package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentPostalCodeValidator")
public class PaymentPostalCodeValidator implements Validator {
    private static final String POSTAL_CODE_PATTERN = "^[0-9]{5}$";
    
    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Die Postleitzahl ist ein Pflichtfeld.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
        
        String postalCode = value.toString().trim();
        if (!postalCode.matches(POSTAL_CODE_PATTERN)) {
            FacesMessage msg = new FacesMessage("Validation failed.", "Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}