// Get booking information from localStorage
function getBookingInfo() {
    try {
        const bookingData = localStorage.getItem('bookingData');
        console.log('Booking data from localStorage:', bookingData);
        
        if (!bookingData) {
            console.error('No booking data found in localStorage');
            // window.location.href = 'index.xhtml';
            return null;
        }
        
        const parsedData = JSON.parse(bookingData);
        console.log('Parsed booking data:', parsedData);
        
        // Prüfen auf die erwarteten Felder
        if (!parsedData || !parsedData.quantity || !parsedData.totalPrice) {
            console.error('Invalid booking data structure:', parsedData);
            // window.location.href = 'index.xhtml';
            return null;
        }
        
        return parsedData;
    } catch (e) {
        console.error('Error parsing booking data:', e);
        // window.location.href = 'index.xhtml';
        return null;
    }
}

// Initialize booking information display
function initializeBookingInfo() {
    console.log('Initializing booking info');
    const bookingInfo = getBookingInfo();
    if (!bookingInfo) {
        console.error('No booking info available');
        return;
    }

    // Update total price
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${bookingInfo.totalPrice.toFixed(2)} €`;
    } else {
        console.error('Total price element not found');
    }
}

// Generate ticket number for concerts
function generateTicketNumber(index) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    
    // Get concertId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const concertId = urlParams.get('concertId');

    return `TKT-${dateStr}-${index}-${concertId}`;
}

// Initialize ticket holder fields
function initializeTicketHolders() {
    console.log('Initializing ticket holders');
    const bookingInfo = getBookingInfo();
    if (!bookingInfo || !bookingInfo.quantity) {
        console.error('No booking info or quantity found');
        return;
    }
    
    const ticketHolderSection = document.getElementById('ticketHolderSection');
    if (!ticketHolderSection) {
        console.error('Ticket holder section not found');
        return;
    }

    const quantity = bookingInfo.quantity;
    console.log('Quantity:', quantity);
    
    // Preis pro Ticket ermitteln
    let pricePerTicket = bookingInfo.pricePerTicket;
    if (!pricePerTicket) {
        const priceElement = document.getElementById('price-per-ticket');
        if (priceElement) {
            pricePerTicket = parseFloat(priceElement.textContent.replace('€', '').trim());
        } else {
            console.error('Price per ticket element not found');
            pricePerTicket = 0;
        }
    }

    function createTicketHolder(index) {
        const ticketId = `ticket-${index}`;
        const ticketHolder = document.createElement('div');
        ticketHolder.className = 'accordion-item bg-dark text-light border-secondary mb-3';
        ticketHolder.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button bg-dark text-light border-0" type="button" data-bs-toggle="collapse" data-bs-target="#${ticketId}" style="box-shadow: none;">
                    <span class="fw-bold">Ticket #${index}</span> - <span class="ticket-status ms-2 opacity-75">Unvollständig</span>
                </button>
            </h2>
            <div id="${ticketId}" class="accordion-collapse collapse show">
                <div class="accordion-body bg-dark">
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label text-light opacity-75">Vorname</label>
                            <input type="text" class="form-control bg-dark text-light border-secondary ticket-firstname" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label text-light opacity-75">Nachname</label>
                            <input type="text" class="form-control bg-dark text-light border-secondary ticket-lastname" required>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add input event listeners
        const firstNameInput = ticketHolder.querySelector('.ticket-firstname');
        const lastNameInput = ticketHolder.querySelector('.ticket-lastname');
        const statusSpan = ticketHolder.querySelector('.ticket-status');

        function checkCompletion() {
            const isComplete = firstNameInput.value.trim() !== '' && lastNameInput.value.trim() !== '';
            statusSpan.textContent = isComplete ? 'Vollständig' : 'Unvollständig';
            statusSpan.className = `ticket-status ms-2 ${isComplete ? 'text-success opacity-75' : 'opacity-75'}`;
        }

        firstNameInput.addEventListener('input', checkCompletion);
        lastNameInput.addEventListener('input', checkCompletion);

        return ticketHolder;
    }

    // Clear existing ticket holders
    ticketHolderSection.innerHTML = '';
    
    // Create ticket holders based on quantity
    for (let i = 0; i < quantity; i++) {
        ticketHolderSection.appendChild(createTicketHolder(i + 1));
    }

    // Update total price
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${(quantity * pricePerTicket).toFixed(2)} €`;
    }
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

// Global error handler to catch all errors
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    console.error('Error message:', e.message);
    console.error('Error stack:', e.error ? e.error.stack : 'No stack available');
    
    // Prevent default behavior (like page reload)
    e.preventDefault();
    
    // Display error message on page
    const errorDisplay = document.createElement('div');
    errorDisplay.style.position = 'fixed';
    errorDisplay.style.top = '0';
    errorDisplay.style.left = '0';
    errorDisplay.style.width = '100%';
    errorDisplay.style.backgroundColor = 'red';
    errorDisplay.style.color = 'white';
    errorDisplay.style.padding = '10px';
    errorDisplay.style.zIndex = '9999';
    errorDisplay.style.fontFamily = 'monospace';
    errorDisplay.style.fontSize = '14px';
    errorDisplay.style.whiteSpace = 'pre-wrap';
    errorDisplay.innerHTML = `
        <strong>Error:</strong> ${e.message}<br>
        ${e.error ? `<strong>Stack:</strong> ${e.error.stack}` : ''}
    `;
    
    document.body.appendChild(errorDisplay);
    
    // Keep the error visible for 30 seconds
    setTimeout(() => {
        if (document.body.contains(errorDisplay)) {
            document.body.removeChild(errorDisplay);
        }
    }, 30000);
    
    return false;
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page loaded');
    
    // Prevent form submission for debugging
    const form = document.getElementById('billingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            console.log('Form submission intercepted');
            e.preventDefault();
            // You can manually trigger the form submission later
            // form.submit();
        });
    }
    
    // Initialize booking info first
    initializeBookingInfo();
    
    // Then initialize ticket holders
    setTimeout(() => {
        initializeTicketHolders();
    }, 100);
    
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