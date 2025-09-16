// Get booking information from localStorage
function getBookingInfo() {
    try {
        const bookingData = localStorage.getItem('bookingData');
        console.log('Booking data from localStorage:', bookingData);
        
        if (!bookingData) {
            console.error('No booking data found in localStorage');
            return null;
        }
        
        return JSON.parse(bookingData);
    } catch (e) {
        console.error('Error parsing booking data:', e);
        return null;
    }
}

// Update booking summary with selected tickets
function updateBookingSummary() {
    const bookingInfo = getBookingInfo();
    if (!bookingInfo) {
        console.error('No booking info available');
        return;
    }

    // Update ticket summary
    const ticketSummaryElement = document.getElementById('ticketSummary');
    if (ticketSummaryElement) {
        ticketSummaryElement.innerHTML = `
            <p>${bookingInfo.quantity} x ${bookingInfo.ticketTypeName}</p>
            <p>Preis pro Ticket: ${bookingInfo.pricePerTicket.toFixed(2)} €</p>
        `;
    } else {
        console.error('Ticket summary element not found');
    }

    // Update total price
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${bookingInfo.totalPrice.toFixed(2)} €`;
    } else {
        console.error('Total price element not found');
    }
}

// Validate all form fields
function validateForm() {
    // Check required billing fields
    const requiredFields = [
        'billingForm:firstName',
        'billingForm:lastName',
        'billingForm:email',
        'billingForm:street',
        'billingForm:houseNumber',
        'billingForm:zipCode',
        'billingForm:city'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            return false;
        }
    }

    // Check payment method specific fields
    const paymentMethod = document.querySelector('input[name="billingForm:paymentMethod"]:checked');
    if (!paymentMethod) {
        return false;
    }

    if (paymentMethod.value === 'sepa') {
        const iban = document.getElementById('billingForm:iban');
        const bic = document.getElementById('billingForm:bic');
        if (!iban || !iban.value.trim() || !bic || !bic.value.trim()) {
            return false;
        }
    } else if (paymentMethod.value === 'creditCard') {
        const cardNumber = document.getElementById('billingForm:cardNumber');
        const expiryDate = document.getElementById('billingForm:expiryDate');
        const cvv = document.getElementById('billingForm:cvv');
        if (!cardNumber || !cardNumber.value.trim() || 
            !expiryDate || !expiryDate.value.trim() || 
            !cvv || !cvv.value.trim()) {
            return false;
        }
    }

    return true;
}

// Update submit button state
function updateSubmitButton() {
    const isValid = validateForm();
    const submitButton = document.getElementById('billingForm:submitButton');
    if (submitButton) {
        submitButton.disabled = !isValid;
    }
}

// Add event listeners to all form fields
function setupFormValidation() {
    const formFields = document.querySelectorAll('#billingForm input, #billingForm select');
    formFields.forEach(field => {
        field.addEventListener('input', updateSubmitButton);
        field.addEventListener('change', updateSubmitButton);
    });

    // Also listen for payment method changes
    const paymentMethods = document.querySelectorAll('input[name="billingForm:paymentMethod"]');
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', () => {
            handlePaymentMethodChange();
            updateSubmitButton();
        });
    });

    // Initial validation
    updateSubmitButton();
}

// Handle payment method selection
function handlePaymentMethodChange() {
    console.log("Payment method changed");
    const paymentMethodSelect = document.querySelector('[name="billingForm:paymentMethod"]:checked');
    if (!paymentMethodSelect) {
        console.error('Payment method select not found');
        return;
    }
    
    const paymentMethod = paymentMethodSelect.value;
    
    const sepaFields = document.getElementById('sepaFields');
    const creditCardFields = document.getElementById('creditCardFields');

    // Reset all fields
    if (sepaFields) sepaFields.style.display = 'none';
    if (creditCardFields) creditCardFields.style.display = 'none';
    
    // Clear and set required attribute for SEPA fields
    const ibanField = document.getElementById('billingForm:iban');
    const bicField = document.getElementById('billingForm:bic');
    if (ibanField && bicField) {
        ibanField.required = false;
        bicField.required = false;
    }
    
    // Clear and set required attribute for credit card fields
    const cardNumberField = document.getElementById('billingForm:cardNumber');
    const expiryDateField = document.getElementById('billingForm:expiryDate');
    const cvvField = document.getElementById('billingForm:cvv');
    if (cardNumberField && expiryDateField && cvvField) {
        cardNumberField.required = false;
        expiryDateField.required = false;
        cvvField.required = false;
    }

    // Show and require fields based on selected payment method
    if (paymentMethod === 'sepa' && sepaFields) {
        sepaFields.style.display = 'block';
        if (ibanField && bicField) {
            ibanField.required = true;
            bicField.required = true;
        }
    } else if (paymentMethod === 'creditCard' && creditCardFields) {
        creditCardFields.style.display = 'block';
        if (cardNumberField && expiryDateField && cvvField) {
            cardNumberField.required = true;
            expiryDateField.required = true;
            cvvField.required = true;
        }
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page loaded');
    
    // Initialize booking info first
    updateBookingSummary();
    
    // Setup form validation
    setupFormValidation();
    
    // Handle payment method changes
    const paymentMethodInputs = document.querySelectorAll('[name="billingForm:paymentMethod"]');
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', handlePaymentMethodChange);
    });

    // Initialize payment fields based on default selection
    setTimeout(() => {
        handlePaymentMethodChange();
    }, 200);
});