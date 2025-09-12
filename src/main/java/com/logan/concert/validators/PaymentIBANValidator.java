package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentIBANValidator")
public class PaymentIBANValidator implements Validator {

    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || value.toString().trim().isEmpty()) {
            return; // Let required=true handle empty fields
        }

        String iban = value.toString().replaceAll("\\s+", ""); // Remove all whitespace

        // Check if IBAN starts with DE and has correct length
        if (!iban.matches("^DE\\d{20}$")) {
            FacesMessage msg = new FacesMessage("IBAN-Format ungültig",
                    "Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Ziffern)");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}