package com.logan.cinema.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("paymentCardNumberValidator")
public class PaymentCardNumberValidator implements Validator {

    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || value.toString().trim().isEmpty()) {
            return; // Let required=true handle empty fields
        }

        String cardNumber = value.toString().replaceAll("\\s+", ""); // Remove all whitespace

        // Check if card number has exactly 16 digits
        if (!cardNumber.matches("^\\d{16}$")) {
            FacesMessage msg = new FacesMessage("Kartennummer ungültig",
                    "Bitte geben Sie eine gültige 16-stellige Kartennummer ein");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }

        // Luhn algorithm check
        if (!isValidLuhn(cardNumber)) {
            FacesMessage msg = new FacesMessage("Kartennummer ungültig",
                    "Die eingegebene Kartennummer ist ungültig");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }

    private boolean isValidLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        
        // Loop through values starting from the rightmost digit
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        // Check if sum is divisible by 10
        return (sum % 10 == 0);
    }
}