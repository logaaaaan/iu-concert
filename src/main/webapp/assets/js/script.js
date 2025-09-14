
// try {
//     // Ihr Code hier
//     function showConcertDetails(cardElement) {
//         console.log("showConcertDetails called");
        
//         const title = cardElement.querySelector('.card-title').textContent;
//         const image = cardElement.querySelector('.card-img-top').src;
//         const venue = cardElement.getAttribute('data-venue');
//         const concertId = cardElement.getAttribute('data-concert-id');
        
//         // Holen der anderen Informationen aus der Karte
//         const description = cardElement.querySelector('.card-text').textContent;
//         const genres = Array.from(cardElement.querySelectorAll('.badge.bg-danger'))
//                             .map(badge => badge.textContent)
//                             .join(', ');
        
//         const modalContent = `
//             <div class="modal-header">
//                 <h5 class="modal-title">${title}</h5>
//                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div class="modal-body">
//                 <div class="row">
//                     <div class="col-md-4">
//                         <img src="${image}" class="img-fluid rounded" alt="${title}"/>
//                     </div>
//                     <div class="col-md-8">
//                         <h6>Ort</h6>
//                         <p>${venue}</p>
//                         <h6>Beschreibung</h6>
//                         <p>${description}</p>
//                         <h6>Genres</h6>
//                         <p>${genres}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="modal-footer">
//                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
//                 <button type="button" class="btn btn-primary book-from-modal">Tickets buchen</button>
//             </div>
//         `;
        
//         const concertModalElement = document.getElementById('concertDetailModal');
//         concertModalElement.querySelector('.modal-content').innerHTML = modalContent;
        
//         // Event-Listener für den Button im Modal
//         concertModalElement.querySelector('.book-from-modal').addEventListener('click', function() {
//             bookTickets(cardElement);
//         });
        
//         const modal = new bootstrap.Modal(concertModalElement);
//         modal.show();
//     }

//     function bookTickets(cardElement) {
//         console.log("bookTickets called");
        
//         try {
//             const concertId = cardElement.getAttribute('data-concert-id');
//             const title = cardElement.querySelector('.card-title').textContent;
//             const image = cardElement.querySelector('.card-img-top').src;
            
//             // Store concert details in localStorage
//             const concertDetails = {
//                 concertId: concertId,
//                 title: title,
//                 image: image
//             };
            
//             try {
//                 localStorage.setItem('selectedConcert', JSON.stringify(concertDetails));
//                 window.location.href = `booking.xhtml?concertId=${concertId}`;
//             } catch (storageError) {
//                 console.error('Failed to store concert details:', storageError);
//                 window.location.href = `booking.xhtml?concertId=${concertId}`;
//             }
//         } catch (error) {
//             console.error('Error during booking:', error);
//         }
//     }

//     // Event-Listener nach dem DOM geladen wurde
//     document.addEventListener('DOMContentLoaded', function() {
//         console.log("DOM fully loaded and parsed");
        
//         // Event-Listener für "Mehr Info" Buttons
//         document.querySelectorAll('.btn-info').forEach(button => {
//             button.addEventListener('click', function() {
//                 const cardElement = this.closest('.card');
//                 showConcertDetails(cardElement);
//             });
//         });
        
//         // Event-Listener für "Tickets" Buttons
//         document.querySelectorAll('.btn-primary').forEach(button => {
//             button.addEventListener('click', function() {
//                 const cardElement = this.closest('.card');
//                 bookTickets(cardElement);
//             });
//         });
//     });

//     // Funktionen global verfügbar machen (falls noch needed)
//     window.showConcertDetails = showConcertDetails;
//     window.bookTickets = bookTickets;

//     console.log("Concert script loaded successfully");
// } catch (error) {
//     console.error('Fehler im Script:', error);
// }
