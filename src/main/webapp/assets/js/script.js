function showConcertDetails(cardElement) {
    const title = cardElement.querySelector('.card-title').textContent;
    const image = cardElement.querySelector('.card-img-top').src;
    const genre = cardElement.querySelector('.badge').textContent;
    const tour = cardElement.dataset.tour;
    const support = cardElement.dataset.support;
    const venue = cardElement.dataset.venue;
    const description = cardElement.dataset.description;
    const rating = cardElement.dataset.rating || '0';
    const video = cardElement.dataset.video || '#';

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <img src="${image}" class="img-fluid rounded" alt="${title}">
                </div>
                <div class="col-md-8">
                    <h6>Tour</h6>
                    <p>${tour || 'N/A'}</p>
                    <h6>Support Acts</h6>
                    <p>${support || 'Keine Vorbands'}</p>
                    <h6>Venue</h6>
                    <p>${venue}</p>
                    <h6>Beschreibung</h6>
                    <p>${description}</p>
                    <div class="concert-meta mb-4">
                        <span class="badge bg-info me-2">${genre}</span>
                        <div class="rating mt-3">
                            <div class="stars" data-rating="${rating}">
                                ${generateStars(rating)}
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <button class="btn btn-secondary me-2" onclick="playVideo('${video}')"><i class="bi bi-play-circle"></i> Video</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalElement = document.getElementById('concertDetailModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function generateStars(rating) {
    const stars = [];
    const ratingNum = parseFloat(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= ratingNum) {
            stars.push('<i class="bi bi-star-fill text-warning"></i>');
        } else if (i - ratingNum < 1) {
            stars.push('<i class="bi bi-star-half text-warning"></i>');
        } else {
            stars.push('<i class="bi bi-star text-warning"></i>');
        }
    }
    return stars.join(' ');
}

function playVideo(videoUrl) {
    try {
        if (!videoUrl || videoUrl === '#') {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-warning';
            errorMessage.textContent = 'Video ist momentan nicht verfügbar.';
            
            const modalBody = document.querySelector('.modal-body');
            const existingAlert = modalBody.querySelector('.alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            modalBody.insertBefore(errorMessage, modalBody.firstChild);
            
            setTimeout(() => errorMessage.remove(), 3000);
            return;
        }
        window.open(videoUrl, '_blank');
    } catch (error) {
        console.error('Error playing video:', error);
    }
}

function bookTickets(element) {
    try {
        if (!element) {
            console.error('Invalid element for booking');
            return;
        }

        const concertId = element.dataset.concertId;
        const title = element.querySelector('.modal-title')?.textContent || 
                     element.querySelector('.card-title')?.textContent;
        const image = element.querySelector('.card-img-top')?.src;
        const genre = element.querySelector('.badge')?.textContent;

        // Store concert details in localStorage
        const concertDetails = {
            concertId: concertId,
            title: title,
            image: image,
            genre: genre
        };
        
        try {
            localStorage.setItem('selectedConcert', JSON.stringify(concertDetails));
            window.location.href = `booking.xhtml?concertId=${concertId}`;
        } catch (storageError) {
            console.error('Failed to store concert details:', storageError);
            window.location.href = `booking.xhtml?concertId=${concertId}`;
        }
    } catch (error) {
        console.error('Error during booking:', error);
    }
}