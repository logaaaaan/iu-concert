// Constants for configuration
const MAX_TICKETS = 10;
const MIN_TICKETS = 1;

// Global variables
let currentQuantity = MIN_TICKETS;
let availableTickets = {}; // Speichert verfügbare Tickets pro Typ
let initialTicketsSet = false; // Stellt sicher, dass Startwerte nur einmal gesetzt werden

// Initialize ticket quantity controls
function initializeTicketQuantity() {
    const decreaseBtn = document.getElementById('decreaseTickets');
    const increaseBtn = document.getElementById('increaseTickets');
    const quantitySpan = document.getElementById('ticketQuantity');
    const ticketTypeSelect = document.getElementById('ticketType');

    if (!decreaseBtn || !increaseBtn || !quantitySpan || !ticketTypeSelect) {
        console.error('Required elements not found');
        return;
    }

    // Initialisiere verfügbare Tickets nur einmal beim ersten Laden
    if (!initialTicketsSet) {
        // Generiere zufällige Startwerte für jeden Tickettyp
        availableTickets = {
            'standing': Math.floor(Math.random() * 100) + 20, // 20-119 Tickets
            'seated': Math.floor(Math.random() * 80) + 30,    // 30-109 Tickets
            'vip': Math.floor(Math.random() * 30) + 10        // 10-39 VIP-Tickets
        };
        initialTicketsSet = true;
        
        // Zeige die Startwerte an
        updateAvailableTickets();
    }

    // Event listeners for quantity buttons
    decreaseBtn.addEventListener('click', () => {
        if (currentQuantity > MIN_TICKETS) {
            currentQuantity--;
            quantitySpan.textContent = currentQuantity;
            updateBookingSummary();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const ticketType = document.getElementById('ticketType').value;
        if (currentQuantity < MAX_TICKETS && currentQuantity < availableTickets[ticketType]) {
            currentQuantity++;
            quantitySpan.textContent = currentQuantity;
            updateBookingSummary();
        }
    });

    // Event listener for ticket type changes
    ticketTypeSelect.addEventListener('change', () => {
        // Update price per ticket display
        const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
        const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
        document.getElementById('pricePerTicket').textContent = pricePerTicket.toFixed(2) + ' €';
        
        // Setze Menge zurück, wenn nicht genug Tickets verfügbar
        const ticketType = selectedOption.value;
        if (currentQuantity > availableTickets[ticketType]) {
            currentQuantity = Math.max(MIN_TICKETS, availableTickets[ticketType]);
            quantitySpan.textContent = currentQuantity;
        }
        
        updateBookingSummary();
        updateAvailableTickets();
    });

    // Initial updates
    updateBookingSummary();
}

function updateBookingSummary() {
    const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
    const totalPrice = quantity * pricePerTicket;

    document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
}

function updateAvailableTickets() {
    const ticketType = document.getElementById('ticketType').value;
    const availableTicketsElement = document.getElementById('availableCount');
    
    if (availableTicketsElement) {
        availableTicketsElement.textContent = availableTickets[ticketType];
        
        // Stil basierend auf Verfügbarkeit
        if (availableTickets[ticketType] <= 0) {
            availableTicketsElement.className = 'text-danger';
        } else if (availableTickets[ticketType] < 10) {
            availableTicketsElement.className = 'text-warning';
        } else {
            availableTicketsElement.className = 'text-success';
        }
    }
}

// Handle booking process
function handleBooking() {
    const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
    const ticketType = selectedOption.value;
    const ticketTypeName = selectedOption.textContent.split(' - ')[0];
    
    // Reduziere verfügbare Tickets
    availableTickets[ticketType] = Math.max(0, availableTickets[ticketType] - quantity);
    
    // Prepare booking data
    const bookingData = {
        quantity: quantity,
        ticketType: ticketType,
        ticketTypeName: ticketTypeName,
        pricePerTicket: pricePerTicket,
        totalPrice: quantity * pricePerTicket,
        remainingTickets: availableTickets[ticketType]
    };

    // Store booking data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Zeige aktualisierte verfügbare Tickets an
    updateAvailableTickets();

    // Redirect to payment page
    const concertId = new URLSearchParams(window.location.search).get('concertId');
    window.location.href = 'payment.xhtml?concertId=' + concertId;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize the necessary functions
    initializeTicketQuantity();
    
    // Add booking button click handler
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.addEventListener('click', handleBooking);
    }
});