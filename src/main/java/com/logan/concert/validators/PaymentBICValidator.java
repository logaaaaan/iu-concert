package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentBICValidator")
public class PaymentBICValidator implements Validator {

    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || value.toString().trim().isEmpty()) {
            return; // Let required=true handle empty fields
        }

        String bic = value.toString().replaceAll("\\s+", ""); // Remove all whitespace

        // Check if BIC has valid length (8 or 11 characters)
        if (!bic.matches("^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$")) {
            FacesMessage msg = new FacesMessage("BIC-Format ungültig",
                    "Bitte geben Sie einen gültigen BIC ein (8 oder 11 Zeichen)");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}