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
    }

    // Update total price
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${bookingInfo.totalPrice.toFixed(2)} €`;
    }

    // Booking data an Hidden Field übergeben
    const bookingDataField = document.getElementById('billingForm:bookingData');
    if (bookingDataField) {
        bookingDataField.value = JSON.stringify(bookingInfo);
        console.log('Booking data set to form field:', bookingDataField.value);
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