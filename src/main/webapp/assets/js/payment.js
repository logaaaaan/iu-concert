// Get booking information from localStorage
function getBookingInfo() {
    const bookingData = localStorage.getItem('bookingData');
    if (!bookingData) {
        window.location.href = 'index.xhtml';
        return null;
    }
    const parsedData = JSON.parse(bookingData);
    if (!parsedData || !parsedData.seats || !parsedData.totalPrice) {
        window.location.href = 'index.xhtml';
        return null;
    }
    return parsedData;
}

// Initialize booking information display
function initializeBookingInfo() {
    const bookingInfo = getBookingInfo();
    if (!bookingInfo) return;

    // Update selected seats
    const seatsList = document.getElementById('selectedSeatsList');
    seatsList.innerHTML = bookingInfo.seats.map(seat =>
        `<li>Reihe ${seat.row}, Sitz ${seat.seat}</li>`
    ).join('');

    // Update total price
    document.getElementById('totalPrice').textContent = `${bookingInfo.totalPrice.toFixed(2)} €`;
}

// Generate ticket number for concerts
function generateTicketNumber(seat) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    
    // Get concertId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const concertId = urlParams.get('concertId');

    return `TKT-${dateStr}-R${seat.row}S${seat.seat}-${concertId}`;
}

// Initialize ticket holder fields
function initializeTicketHolders() {
    const bookingInfo = getBookingInfo();
    if (!bookingInfo || !bookingInfo.seats) return;
    const ticketHolderSection = document.getElementById('ticketHolderSection');
    if (!ticketHolderSection) return;

    const seats = bookingInfo.seats;
    const pricePerTicket = parseFloat(document.getElementById('price-per-ticket').textContent.replace('€', ''));

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

    // Create ticket holders based on selected seats
    seats.forEach((_, index) => {
        ticketHolderSection.appendChild(createTicketHolder(index + 1));
    });

    // Update total price
    const totalPrice = document.getElementById('totalPrice');
    if (totalPrice) {
        totalPrice.textContent = `${(seats.length * pricePerTicket).toFixed(2)} €`;
    }
}

// Collect ticket holder information
function collectTicketHolderInfo() {
    const bookingInfo = getBookingInfo();
    if (!bookingInfo || !bookingInfo.seats) return null;

    const ticketHolders = [];
    const ticketElements = document.querySelectorAll('.accordion-item');

    for (let i = 0; i < ticketElements.length; i++) {
        const element = ticketElements[i];
        const firstName = element.querySelector('.ticket-firstname').value.trim();
        const lastName = element.querySelector('.ticket-lastname').value.trim();
        const ticketNumber = generateTicketNumber(bookingInfo.seats[i]);
        const price = parseFloat(document.getElementById('price-per-ticket').textContent.replace('€', ''));
        const concertTime = document.querySelector('.concert-time')?.textContent || '19:30';

        if (!firstName || !lastName) return null;

        ticketHolders.push({
            seat: bookingInfo.seats[i],
            concertTime: concertTime,
            price: price,
            firstName: firstName,
            lastName: lastName,
            ticketNumber: ticketNumber,
            ticketType: bookingInfo.ticketType || 'Standard'
        });
    }
    return ticketHolders;
}

// Handle payment method selection
function handlePaymentMethodChange() {
    console.log("Payment method changed");
    const paymentMethodSelect = document.querySelector('[name="billingForm:paymentMethod"]:checked');
    const paymentMethod = paymentMethodSelect.value;
    
    const sepaFields = document.getElementById('sepaFields');
    const creditCardFields = document.getElementById('creditCardFields');

    // Reset all fields
    sepaFields.style.display = 'none';
    creditCardFields.style.display = 'none';
    
    // Clear and set required attribute for SEPA fields
    const ibanField = document.getElementById('billingForm:iban');
    const bicField = document.getElementById('billingForm:bic');
    ibanField.value = '';
    bicField.value = '';
    ibanField.required = false;
    bicField.required = false;
    
    // Clear and set required attribute for credit card fields
    const cardNumberField = document.getElementById('billingForm:cardNumber');
    const expiryDateField = document.getElementById('billingForm:expiryDate');
    const cvvField = document.getElementById('billingForm:cvv');
    cardNumberField.value = '';
    expiryDateField.value = '';
    cvvField.value = '';
    cardNumberField.required = false;
    expiryDateField.required = false;
    cvvField.required = false;

    // Show and require fields based on selected payment method
    if (paymentMethod === 'sepa') {
        sepaFields.style.display = 'block';
        ibanField.required = true;
        bicField.required = true;
    } else if (paymentMethod === 'creditCard') {
        creditCardFields.style.display = 'block';
        cardNumberField.required = true;
        expiryDateField.required = true;
        cvvField.required = true;
    }
}

// Format card number with spaces
function formatCardNumber(input) {
    const value = input.value.replace(/\s/g, '');
    input.value = value.replace(/(.{4})/g, '$1 ').trim();
}

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-warning fade-in';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeBookingInfo();
    initializeTicketHolders();

    // Add input event listeners for real-time validation
    const form = document.getElementById('billingForm');
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        if (input.id === 'billingForm:cardNumber') {
            input.addEventListener('input', () => formatCardNumber(input));
        }
    });

    // Handle payment method changes
    const paymentMethodInputs = document.querySelectorAll('[name="billingForm:paymentMethod"]');
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', handlePaymentMethodChange);
    });

    // Initialize payment fields based on default selection
    handlePaymentMethodChange();

    // Add payment form submit handler
    form.addEventListener('submit', (e) => {
        
        // Validate ticket holder information
        const ticketHolders = collectTicketHolderInfo();
        if (!ticketHolders) {
            showError('Bitte füllen Sie alle Ticketinhaber-Informationen aus.');
            return;
        }
        
        try {
            // Set form data
            const concertIdField = document.getElementById('billingForm:concertId');
            const totalField = document.getElementById('billingForm:total');
            const ticketHoldersField = document.getElementById('billingForm:ticketHoldersData');
            
            if (!concertIdField || !totalField || !ticketHoldersField) {
                throw new Error('Required form fields not found');
            }
            
            // Get concertId from URL
            const urlParams = new URLSearchParams(window.location.search);
            const concertId = urlParams.get('concertId');
            
            if (!concertId) {
                throw new Error('Concert information not found');
            }
            
            concertIdField.value = concertId;
            totalField.value = ticketHolders.reduce((sum, holder) => sum + holder.price, 0);
            ticketHoldersField.value = JSON.stringify(ticketHolders);
        } catch (error) {
            e.preventDefault();
            console.error('Error preparing form submission:', error);
            showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
    });
});