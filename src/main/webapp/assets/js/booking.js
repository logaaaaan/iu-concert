// Constants for configuration
const MAX_TICKETS = 10;
const MIN_TICKETS = 1;

// Global variables
let currentQuantity = MIN_TICKETS;

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

    // Event listeners for quantity buttons
    decreaseBtn.addEventListener('click', () => {
        if (currentQuantity > MIN_TICKETS) {
            currentQuantity--;
            quantitySpan.textContent = currentQuantity;
            updateBookingSummary();
            updateAvailableTickets();
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (currentQuantity < MAX_TICKETS) {
            currentQuantity++;
            quantitySpan.textContent = currentQuantity;
            updateBookingSummary();
            updateAvailableTickets();
        }
    });

    // Event listener for ticket type changes
    ticketTypeSelect.addEventListener('change', () => {
        // Update price per ticket display
        const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
        const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
        document.getElementById('pricePerTicket').textContent = pricePerTicket.toFixed(2) + ' €';
        
        updateBookingSummary();
        updateAvailableTickets();
    });

    // Initial updates
    updateBookingSummary();
    updateAvailableTickets();
}

// Update booking summary with selected tickets
function updateBookingSummary() {
    const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const pricePerTicket = parseFloat(selectedOption.getAttribute('data-price'));
    const totalPriceElement = document.getElementById('totalPrice');
    const selectedTicketsList = document.getElementById('selectedTicketsList');
    const bookButton = document.getElementById('bookButton');

    // Calculate total price
    const totalPrice = quantity * pricePerTicket;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;

    // Update selected tickets list
    selectedTicketsList.innerHTML = '';
    const ticketTypeName = selectedOption.textContent.split(' - ')[0];
    
    for (let i = 0; i < quantity; i++) {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'selected-ticket';
        ticketDiv.innerHTML = `
            <span>${ticketTypeName} #${i + 1}</span>
            <span>${pricePerTicket.toFixed(2)} €</span>
        `;
        selectedTicketsList.appendChild(ticketDiv);
    }

    // Enable/disable book button
    const availableTickets = calculateAvailableTickets();
    bookButton.disabled = quantity === 0 || quantity > availableTickets;
    
    if (bookButton.disabled) {
        bookButton.classList.remove('btn-primary');
        bookButton.classList.add('btn-secondary');
    } else {
        bookButton.classList.remove('btn-secondary');
        bookButton.classList.add('btn-primary');
    }
}

// Calculate available tickets
function calculateAvailableTickets() {
    const ticketTypeSelect = document.getElementById('ticketType');
    const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
    const ticketType = selectedOption.value;
    
    // Get venue capacities
    const totalCapacity = parseInt(document.getElementById('venueTotalCapacity').value) || 0;
    const standingCapacity = parseInt(document.getElementById('venueStandingCapacity').value) || 0;
    const seatingCapacity = parseInt(document.getElementById('venueSeatingCapacity').value) || 0;
    const vipCapacity = parseInt(document.getElementById('venueVipCapacity').value) || 0;
    const bookedTickets = parseInt(document.getElementById('bookedTickets').value) || 0;
    
    // Calculate available tickets based on ticket type
    let capacity = 0;
    
    switch(ticketType) {
        case 'standing':
            capacity = standingCapacity > 0 ? standingCapacity : totalCapacity;
            break;
        case 'seated':
            capacity = seatingCapacity > 0 ? seatingCapacity : totalCapacity;
            break;
        case 'vip':
            capacity = vipCapacity > 0 ? vipCapacity : totalCapacity;
            break;
        default:
            capacity = totalCapacity;
    }
    
    return Math.max(0, capacity - bookedTickets);
}

// Update available tickets display
function updateAvailableTickets() {
    const availableTickets = calculateAvailableTickets();
    const availableTicketsElement = document.getElementById('availableTickets');
    const increaseBtn = document.getElementById('increaseTickets');
    
    if (availableTicketsElement) {
        availableTicketsElement.textContent = `Verfügbare Tickets: ${availableTickets}`;
        
        // Style based on availability
        if (availableTickets <= 0) {
            availableTicketsElement.className = 'text-danger fw-bold';
        } else if (availableTickets < 10) {
            availableTicketsElement.className = 'text-warning fw-bold';
        } else {
            availableTicketsElement.className = 'text-success fw-bold';
        }
    }
    
    // Enable/disable increase button based on availability
    if (increaseBtn) {
        increaseBtn.disabled = currentQuantity >= availableTickets || currentQuantity >= MAX_TICKETS;
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