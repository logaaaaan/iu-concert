// Get booking information from multiple sources
function getBookingInfo() {
    try {
        // First try URL parameters (primary source)
        const urlParams = new URLSearchParams(window.location.search);
        const bookingDataParam = urlParams.get('bookingData');
        
        if (bookingDataParam) {
            console.log('Booking data from URL parameter:', bookingDataParam);
            // Store in sessionStorage as backup
            sessionStorage.setItem('bookingData', bookingDataParam);
            return JSON.parse(bookingDataParam);
        }
        
        // Fallback to sessionStorage (if URL param is missing due to form submission)
        const sessionData = sessionStorage.getItem('bookingData');
        if (sessionData) {
            console.log('Booking data from sessionStorage:', sessionData);
            return JSON.parse(sessionData);
        }
        
        // Last fallback to localStorage (legacy support)
        const localData = localStorage.getItem('bookingData');
        if (localData) {
            console.log('Booking data from localStorage (fallback):', localData);
            // Migrate to sessionStorage
            sessionStorage.setItem('bookingData', localData);
            return JSON.parse(localData);
        }
        
        console.error('No booking data found in any source');
        return null;
        
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

    console.log('Updating booking summary with:', bookingInfo);

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

    // Set booking data to hidden field - this is crucial for form submission
    const bookingDataField = document.getElementById('billingForm:bookingData');
    if (bookingDataField) {
        const bookingDataJson = JSON.stringify(bookingInfo);
        bookingDataField.value = bookingDataJson;
        console.log('Booking data set to form field:', bookingDataField.value);
    } else {
        console.error('Hidden booking data field not found!');
    }
    
    // Also set it as a hidden input if the above doesn't exist
    let hiddenInput = document.querySelector('input[name="bookingData"]');
    if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'bookingData';
        hiddenInput.id = 'bookingDataHidden';
        document.querySelector('#billingForm').appendChild(hiddenInput);
    }
    hiddenInput.value = JSON.stringify(bookingInfo);
}

// Enhanced form validation that preserves data
function validateForm() {
    // Ensure booking data is still available
    const bookingInfo = getBookingInfo();
    if (!bookingInfo) {
        console.error('Booking data lost during validation');
        return false;
    }
    
    // Update hidden field before validation
    updateBookingSummary();
    
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

    let allValid = true;
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            allValid = false;
            break;
        }
    }

    // Check payment method specific fields
    const paymentMethod = document.querySelector('input[name="billingForm:paymentMethod"]:checked');
    if (!paymentMethod) {
        allValid = false;
    }

    return allValid;
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

// Enhanced form submission handler
function handleFormSubmit() {
    const bookingInfo = getBookingInfo();
    if (!bookingInfo) {
        alert('Buchungsdaten sind verloren gegangen. Bitte starten Sie erneut.');
        return false;
    }
    
    // Ensure the hidden field has the booking data
    const bookingDataField = document.getElementById('billingForm:bookingData');
    if (bookingDataField) {
        bookingDataField.value = JSON.stringify(bookingInfo);
    }
    
    return true;
}

// Function to handle payment method changes (you need to implement this)
function handlePaymentMethodChange() {
    // Implement your payment method specific logic here
    console.log('Payment method changed');
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

    // Add form submit handler
    const form = document.getElementById('billingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize payment fields based on default selection
    setTimeout(() => {
        handlePaymentMethodChange();
    }, 200);
    
    // Periodic check to ensure data persistence during validation errors
    setInterval(() => {
        const bookingInfo = getBookingInfo();
        if (bookingInfo) {
            const bookingDataField = document.getElementById('billingForm:bookingData');
            if (bookingDataField && !bookingDataField.value) {
                bookingDataField.value = JSON.stringify(bookingInfo);
                console.log('Restored booking data to form field');
            }
        }
    }, 1000);
});