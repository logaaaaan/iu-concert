package com.logan.concert.validators;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;

@FacesValidator("paymentExpiryDateValidator")
public class PaymentExpiryDateValidator implements Validator {

    @Override
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        if (value == null || value.toString().trim().isEmpty()) {
            return; // Let required=true handle empty fields
        }

        String expiryDate = value.toString().trim();

        // Check format (MM/YY)
        if (!expiryDate.matches("^(0[1-9]|1[0-2])/([0-9]{2})$")) {
            FacesMessage msg = new FacesMessage("Ablaufdatum ungültig",
                    "Bitte geben Sie das Ablaufdatum im Format MM/YY ein");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }

        try {
            // Parse the expiry date
            String[] parts = expiryDate.split("/");
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]) + 2000; // Convert YY to 20YY

            YearMonth cardExpiry = YearMonth.of(year, month);
            YearMonth now = YearMonth.now();

            // Check if card has expired
            if (cardExpiry.isBefore(now)) {
                FacesMessage msg = new FacesMessage("Karte abgelaufen",
                        "Die Karte ist bereits abgelaufen");
                msg.setSeverity(FacesMessage.SEVERITY_ERROR);
                throw new ValidatorException(msg);
            }

            // Check if expiry date is too far in the future (more than 10 years)
            if (cardExpiry.isAfter(now.plusYears(10))) {
                FacesMessage msg = new FacesMessage("Ablaufdatum ungültig",
                        "Das Ablaufdatum liegt zu weit in der Zukunft");
                msg.setSeverity(FacesMessage.SEVERITY_ERROR);
                throw new ValidatorException(msg);
            }
        } catch (NumberFormatException | DateTimeParseException e) {
            FacesMessage msg = new FacesMessage("Ablaufdatum ungültig",
                    "Bitte geben Sie ein gültiges Ablaufdatum ein");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}