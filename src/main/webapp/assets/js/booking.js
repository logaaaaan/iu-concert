// Constants for configuration
const MAX_TICKETS = 10;
const MIN_TICKETS = 1;

// Global variables
let currentQuantity = MIN_TICKETS;

// Calculate available tickets based on venue capacity and sold tickets
function calculateAvailableTickets() {
    const ticketType = document.getElementById('ticketType').value;
    
    // Get venue capacities from hidden fields
    const standingCapacity = parseInt(document.getElementById('venueStandingCapacity').value) || 0;
    const seatingCapacity = parseInt(document.getElementById('venueSeatingCapacity').value) || 0;
    const vipCapacity = parseInt(document.getElementById('venueVipCapacity').value) || 0;
    
    // Get sold tickets from hidden fields
    const standingSold = parseInt(document.getElementById('standingSold').value) || 0;
    const seatingSold = parseInt(document.getElementById('seatingSold').value) || 0;
    const vipSold = parseInt(document.getElementById('vipSold').value) || 0;
    
    // Calculate available tickets (capacity - sold tickets)
    let available = 0;
    
    switch(ticketType) {
        case 'standing':
            available = Math.max(0, standingCapacity - standingSold);
            break;
        case 'seated':
            available = Math.max(0, seatingCapacity - seatingSold);
            break;
        case 'vip':
            available = Math.max(0, vipCapacity - vipSold);
            break;
        default:
            available = 0;
    }
    
    return available;
}

// Update available tickets display
function updateAvailableTickets() {
    const availableTickets = calculateAvailableTickets();
    const availableTicketsElement = document.getElementById('availableCount');
    
    if (availableTicketsElement) {
        availableTicketsElement.textContent = availableTickets;
        
        // Style based on availability
        if (availableTickets <= 0) {
            availableTicketsElement.className = 'text-danger';
        } else if (availableTickets < 10) {
            availableTicketsElement.className = 'text-warning';
        } else {
            availableTicketsElement.className = 'text-success';
        }
    }
    
    // Enable/disable increase button based on availability
    const increaseBtn = document.getElementById('increaseTickets');
    if (increaseBtn) {
        increaseBtn.disabled = currentQuantity >= availableTickets || currentQuantity >= MAX_TICKETS;
    }
    
    // Deaktiviere den Book-Button wenn keine Tickets verfügbar sind
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.disabled = availableTickets <= 0;
        if (availableTickets <= 0) {
            bookButton.textContent = 'Ausverkauft';
            bookButton.classList.add('btn-secondary');
            bookButton.classList.remove('btn-primary');
        } else {
            bookButton.textContent = 'Jetzt Buchen';
            bookButton.classList.add('btn-primary');
            bookButton.classList.remove('btn-secondary');
        }
    }
}

// Update booking summary with selected tickets
function updateBookingSummary() {
    const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
    const totalPrice = quantity * pricePerTicket;

    // Update all summary elements
    document.getElementById('selectedQuantity').textContent = quantity;
    document.getElementById('selectedType').textContent = selectedOption.text.split(' - ')[0];
    document.getElementById('pricePerTicket').textContent = pricePerTicket.toFixed(2) + ' €';
    document.getElementById('lineTotal').textContent = (pricePerTicket * quantity).toFixed(2) + '€';
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2) + ' €';
}

// Quantity controls
function setupQuantityControls() {
    document.getElementById('increaseTickets').addEventListener('click', function() {
        const quantityElement = document.getElementById('ticketQuantity');
        let quantity = parseInt(quantityElement.textContent);
        const maxTickets = parseInt(document.getElementById('availableCount').textContent);
        
        if (quantity < maxTickets && quantity < 10) {
            quantityElement.textContent = quantity + 1;
            currentQuantity = quantity + 1;
            updateBookingSummary();
            updateAvailableTickets();
        }
    });

    document.getElementById('decreaseTickets').addEventListener('click', function() {
        const quantityElement = document.getElementById('ticketQuantity');
        let quantity = parseInt(quantityElement.textContent);
        
        if (quantity > 1) {
            quantityElement.textContent = quantity - 1;
            currentQuantity = quantity - 1;
            updateBookingSummary();
            updateAvailableTickets();
        }
    });

    // Ticket type change
    document.getElementById('ticketType').addEventListener('change', function() {
        // Reset quantity to 1 when changing ticket type
        document.getElementById('ticketQuantity').textContent = '1';
        currentQuantity = 1;
        updateBookingSummary();
        updateAvailableTickets();
    });
}

// Handle booking process
function handleBooking() {
    const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
    const ticketType = selectedOption.value;
    const ticketTypeName = selectedOption.textContent.split(' - ')[0];
    
    // Prepare booking data
    const bookingData = {
        quantity: quantity,
        ticketType: ticketType,
        ticketTypeName: ticketTypeName,
        pricePerTicket: pricePerTicket,
        totalPrice: quantity * pricePerTicket
    };

    // Store booking data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Redirect to payment page with booking data as URL parameter
    const concertId = new URLSearchParams(window.location.search).get('concertId');
    const url = new URL('payment.xhtml', window.location.origin);
    url.searchParams.set('concertId', concertId);
    url.searchParams.set('bookingData', JSON.stringify(bookingData));
    
    window.location.href = url.toString();
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupQuantityControls();
    
    // Add booking button click handler
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.addEventListener('click', handleBooking);
    }
    
    // Initial updates
    updateBookingSummary();
    updateAvailableTickets();
});