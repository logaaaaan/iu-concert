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

    document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
}

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
        const availableTickets = calculateAvailableTickets();
        if (currentQuantity < MAX_TICKETS && currentQuantity < availableTickets) {
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
        
        // Reset quantity if not enough tickets available
        const availableTickets = calculateAvailableTickets();
        if (currentQuantity > availableTickets) {
            currentQuantity = Math.max(MIN_TICKETS, availableTickets);
            quantitySpan.textContent = currentQuantity;
        }
        
        updateBookingSummary();
        updateAvailableTickets();
    });

    // Initial updates
    updateBookingSummary();
    updateAvailableTickets();
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
document.addEventListener('DOMContentLoaded', () => {
    initializeTicketQuantity();
    
    // Add booking button click handler
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.addEventListener('click', handleBooking);
    }
});


        // Update available tickets display based on selected ticket type
        function updateAvailableTickets() {
            const ticketType = document.getElementById('ticketType').value;
            const availableCount = document.getElementById('availableCount');
            
            // Get capacity and sold data
            const standingCapacity = parseInt(document.getElementById('venueStandingCapacity').value);
            const seatingCapacity = parseInt(document.getElementById('venueSeatingCapacity').value);
            const vipCapacity = parseInt(document.getElementById('venueVipCapacity').value);
            const standingSold = parseInt(document.getElementById('standingSold').value);
            const seatingSold = parseInt(document.getElementById('seatingSold').value);
            const vipSold = parseInt(document.getElementById('vipSold').value);
            
            let available = 0;
            switch(ticketType) {
                case 'standing':
                    available = standingCapacity - standingSold;
                    break;
                case 'seated':
                    available = seatingCapacity - seatingSold;
                    break;
                case 'vip':
                    available = vipCapacity - vipSold;
                    break;
            }
            
            availableCount.textContent = available;
        }

        // Update price and summary when ticket type or quantity changes
        function updateSummary() {
            const ticketType = document.getElementById('ticketType');
            const quantity = parseInt(document.getElementById('ticketQuantity').textContent);
            const selectedOption = ticketType.options[ticketType.selectedIndex];
            const price = parseFloat(selectedOption.dataset.price);
            const typeText = selectedOption.text.split(' - ')[0];
            
            // Update summary display
            document.getElementById('selectedQuantity').textContent = quantity;
            document.getElementById('selectedType').textContent = typeText;
            document.getElementById('pricePerTicket').textContent = price + ' €';
            document.getElementById('lineTotal').textContent = (price * quantity).toFixed(2) + '€';
            document.getElementById('totalPrice').textContent = (price * quantity).toFixed(2) + ' €';
            
            updateAvailableTickets();
        }

        // Quantity controls
        document.getElementById('increaseTickets').addEventListener('click', function() {
            const quantityElement = document.getElementById('ticketQuantity');
            let quantity = parseInt(quantityElement.textContent);
            const maxTickets = parseInt(document.getElementById('availableCount').textContent);
            
            if (quantity &lt; maxTickets &amp;&amp; quantity &lt; 10) {
                quantityElement.textContent = quantity + 1;
                updateSummary();
            }
        });

        document.getElementById('decreaseTickets').addEventListener('click', function() {
            const quantityElement = document.getElementById('ticketQuantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity &gt; 1) {
                quantityElement.textContent = quantity - 1;
                updateSummary();
            }
        });

        // Ticket type change
        document.getElementById('ticketType').addEventListener('change', function() {
            // Reset quantity to 1 when changing ticket type
            document.getElementById('ticketQuantity').textContent = '1';
            updateSummary();
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateSummary();
        });