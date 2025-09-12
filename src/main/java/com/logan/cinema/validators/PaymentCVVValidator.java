package com.logan.cinema.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentCVVValidator")
public class PaymentCVVValidator implements Validator {

    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || value.toString().trim().isEmpty()) {
            return; // Let required=true handle empty fields
        }

        String cvv = value.toString().trim();

        // Check if CVV has 3 or 4 digits
        if (!cvv.matches("^\\d{3,4}$")) {
            FacesMessage msg = new FacesMessage("CVV ungültig",
                    "Bitte geben Sie einen gültigen CVV-Code ein (3-4 Ziffern)");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}