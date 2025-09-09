// Constants for configuration
const MAX_TICKETS = 5;
const MIN_TICKETS = 1;

// Initialize ticket quantity controls with error handling
function initializeTicketQuantity() {
    const decreaseBtn = document.getElementById('decreaseTickets');
    const increaseBtn = document.getElementById('increaseTickets');
    const quantitySpan = document.getElementById('ticketQuantity');
    let currentQuantity = MIN_TICKETS;

    if (!decreaseBtn || !increaseBtn || !quantitySpan) {
        console.error('Required ticket quantity elements not found');
        return;
    }

    const updateQuantity = (newQuantity) => {
        if (newQuantity >= MIN_TICKETS && newQuantity <= MAX_TICKETS) {
            currentQuantity = newQuantity;
            quantitySpan.textContent = currentQuantity;
            updateSeatSelection();
        }
    };

    decreaseBtn.addEventListener('click', () => updateQuantity(currentQuantity - 1));
    increaseBtn.addEventListener('click', () => updateQuantity(currentQuantity + 1));
}

// Generate seats grid with row numbers and error handling
function generateSeats() {
    try {
        const container = document.getElementById('seatsContainer');
        const seatPlacementElement = document.getElementById('venue:seatPlacement');
        const hasStandingElement = document.getElementById('venue:hasStanding');

        if (!container || !seatPlacementElement) {
            throw new Error('Required seat container elements not found');
        }

        const seatPlacement = seatPlacementElement.value;
        const dict = JSON.parse(seatPlacement);
        const rows = dict['rows'];
        const seatsPerRow = dict['columns'];

        if (!rows || !seatsPerRow) {
            throw new Error('Invalid seat placement configuration');
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();

        // Generate seats
        for (let row = 0; row < rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';

            // Add row number
            const rowNumber = document.createElement('div');
            rowNumber.className = 'row-number';
            rowNumber.textContent = row + 1;
            rowDiv.appendChild(rowNumber);

            for (let seat = 0; seat < seatsPerRow; seat++) {
                const seatNumber = row * seatsPerRow + seat + 1;
                const seatElement = document.createElement('div');
                seatElement.className = 'seat available';
                seatElement.dataset.seatNumber = seatNumber;
                seatElement.dataset.row = row + 1;
                seatElement.dataset.seat = seat + 1;
                seatElement.title = `Reihe ${row + 1}, Sitz ${seat + 1}`;
                rowDiv.appendChild(seatElement);
            }

            fragment.appendChild(rowDiv);
        }

        container.appendChild(fragment);
    } catch (error) {
        console.error('Error generating seats:', error);
        const container = document.getElementById('seatsContainer');
        if (container) {
            container.innerHTML = '<div class="alert alert-danger">Fehler beim Laden der Sitzplätze</div>';
        }
    }
}

// Handle seat selection with improved error handling and animations
function handleSeatSelection() {
    const container = document.getElementById('seatsContainer');
    const quantitySpan = document.getElementById('ticketQuantity');

    if (!container || !quantitySpan) {
        console.error('Required seat selection elements not found');
        return;
    }

    const addTemporaryClass = (element, className, duration = 500) => {
        element.classList.add(className);
        setTimeout(() => element.classList.remove(className), duration);
    };

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

    container.addEventListener('click', (e) => {
        const seat = e.target;
        if (!seat.classList.contains('seat')) return;

        if (seat.classList.contains('occupied')) {
            addTemporaryClass(seat, 'shake');
            showError('Dieser Sitzplatz ist bereits belegt');
            return;
        }

        const maxSeats = parseInt(quantitySpan.textContent);
        const currentSelected = container.querySelectorAll('.seat.selected').length;

        if (!seat.classList.contains('selected') && currentSelected >= maxSeats) {
            addTemporaryClass(seat, 'shake');
            showError(`Sie können nur ${maxSeats} Sitzplätze auswählen`);
            return;
        }

        seat.classList.toggle('selected');
        addTemporaryClass(seat, 'pulse');
        updateSelectedSeats();
    });
}

function updateSeatSelection() {
    const container = document.getElementById('seatsContainer');
    const maxSeats = parseInt(document.getElementById('ticketQuantity').textContent);
    const selectedSeats = container.querySelectorAll('.seat.selected');

    if (selectedSeats.length > maxSeats) {
        Array.from(selectedSeats)
            .slice(maxSeats)
            .forEach(seat => seat.classList.remove('selected'));
    }
    // Always update the selected seats list and total price
    updateSelectedSeats();
}

// Make updateSelectedSeats globally accessible
// Make updateSelectedSeats globally accessible
function updateSelectedSeats() {
    const container = document.getElementById('seatsContainer');
    const selectedSeatsList = document.getElementById('selectedSeatsList');
    const totalPriceElement = document.getElementById('totalPrice');
    const bookButton = document.getElementById('bookButton');
    const pricePerTicket = parseFloat(document.getElementById('pricePerTicket').textContent.replace('€', ''));

    const selectedSeats = container.querySelectorAll('.seat.selected');
    while (selectedSeatsList.firstChild) {
        selectedSeatsList.removeChild(selectedSeatsList.firstChild);
    }

    Array.from(selectedSeats).forEach(seat => {
        const seatNumber = seat.dataset.seatNumber;
        const row = Math.floor((seatNumber - 1) / 10) + 1;
        const seatInRow = ((seatNumber - 1) % 10) + 1;

        const li = document.createElement('li');
        li.classList.add('fade-in');

        const seatSpan = document.createElement('span');
        seatSpan.textContent = `Reihe ${row}, Sitz ${seatInRow}`;

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `${pricePerTicket.toFixed(2)} €`;

        li.appendChild(seatSpan);
        li.appendChild(priceSpan);
        selectedSeatsList.appendChild(li);
    });

    const totalPrice = selectedSeats.length * pricePerTicket;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;
    bookButton.disabled = selectedSeats.length === 0;

    if (bookButton.disabled) {
        bookButton.classList.remove('btn-primary');
        bookButton.classList.add('btn-secondary');
    } else {
        bookButton.classList.remove('btn-secondary');
        bookButton.classList.add('btn-primary');
    }
}

function fillAlreadyBookedSeats() {
    const ticketTypeSelect = document.getElementById('ticketType');
    
    // Handle ticket type changes instead of showtime

    if (ticketTypeSelect) {
        ticketTypeSelect.addEventListener('change', () => {
            const selectedType = ticketTypeSelect.value;
            const seatsContainer = document.getElementById('seatsContainer');
            
            // Show/hide seat selection based on ticket type
            if (selectedType === 'standing') {
                seatsContainer.style.display = 'none';
            } else {
                seatsContainer.style.display = 'block';
            }
            
            // Update price per ticket
            const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            document.getElementById('pricePerTicket').textContent = price + ' €';
            updateSelectedSeats();
        });
    }

    // Load already booked seats from database
    const bookedSeatsData = document.querySelector('[data-booked-seats]');
    if (bookedSeatsData) {
        const bookedSeatsString = bookedSeatsData.getAttribute('data-booked-seats');
        if (bookedSeatsString && bookedSeatsString !== '[]') {
            const bookedSeats = bookedSeatsString.substring(1, bookedSeatsString.length-1).split(", ");
            bookedSeats.forEach(seat => {
                const [row, seatNumber] = seat.split(":");
                const formattedSeatNumber = parseInt(row) * 10 + parseInt(seatNumber) - 10;
                const seatElem = document.querySelector(`[data-seat-number="${formattedSeatNumber}"]`);
                if (seatElem) {
                    seatElem.classList.remove('available');
                    seatElem.classList.add('occupied');
                }
            });
        }
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTicketQuantity();
    generateSeats();
    fillAlreadyBookedSeats();
    handleSeatSelection();

    // Add booking button click handler
    document.getElementById('bookButton').addEventListener('click', handleBooking);
});

// Update handleBooking function for concerts
function handleBooking() {
    const ticketType = document.getElementById('ticketType').value;
    const selectedSeats = Array.from(document.querySelectorAll('.seat.selected')).map(seat => {
        const seatNumber = parseInt(seat.dataset.seatNumber);
        const row = Math.floor((seatNumber - 1) / 10) + 1;
        const seatInRow = ((seatNumber - 1) % 10) + 1;
        return { row, seat: seatInRow, seatNumber };
    });

    const bookingData = {
        ticketType: ticketType,
        seats: selectedSeats,
        totalPrice: parseFloat(document.getElementById('totalPrice').textContent.replace('€', ''))
    };

    // Store booking data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Retrieve the concertId from the URL
    const concertId = new URLSearchParams(window.location.search).get('concertId');

    window.location.href = 'payment.xhtml?concertId=' + concertId;
}