const carousel = document.getElementById('carousel');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angleValue');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

let currentAngle = 45;
let animationId = null;
let position = 0; // Single axis position
let speed = 2;
let isPaused = false;

// Store original tickets count and duplicate them for seamless loop
let originalTicketCount = 0;

function setupTickets() {
    // Get the original tickets from HTML
    const originalTickets = Array.from(carousel.querySelectorAll('.ticket'));
    originalTicketCount = originalTickets.length;

    // Clone the entire set of tickets twice for seamless loop (3 sets total)
    // First, clone all tickets once
    originalTickets.forEach(ticket => {
        const clone1 = ticket.cloneNode(true);
        carousel.appendChild(clone1);
    });

    // Then clone all tickets again
    originalTickets.forEach(ticket => {
        const clone2 = ticket.cloneNode(true);
        carousel.appendChild(clone2);
    });

    // Add event listeners to all tickets (original + clones)
    const allTickets = carousel.querySelectorAll('.ticket');
    allTickets.forEach(ticketEl => {
        // Add hover listeners
        ticketEl.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        ticketEl.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Add click listener
        ticketEl.addEventListener('click', () => {
            const link = ticketEl.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
    });
}

// Calculate movement with rotation
function animate() {
    if (!isPaused) {
        // Move along single axis
        position += speed;

        // Calculate dimensions for seamless loop dynamically
        const firstTicket = carousel.querySelector('.ticket');
        if (firstTicket && originalTicketCount > 0) {
            const ticketWidth = firstTicket.offsetWidth;
            const computedStyle = window.getComputedStyle(carousel);
            const gap = parseFloat(computedStyle.gap) || 0;
            const singleSetWidth = (ticketWidth + gap) * originalTicketCount;

            // Reset position when one set of tickets has passed for seamless loop
            if (position >= singleSetWidth) {
                position = position - singleSetWidth;
            }

            // Apply transforms: translate to center, rotate, then translate along x-axis for movement
            // The translate(-50%, -50%) centers the carousel at the screen center
            carousel.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg) translateX(${-position}px)`;
        }
    }

    animationId = requestAnimationFrame(animate);
}

// Update angle
angleInput.addEventListener('input', (e) => {
    currentAngle = parseInt(e.target.value);
    angleValue.textContent = currentAngle;
});

// Update speed
speedInput.addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
    speedValue.textContent = speed;
});

// Initialize
function init() {
    setupTickets();
    position = 0;
    animate();
}

// Handle window resize to recalculate dimensions
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reset position on resize to avoid glitches
        const firstTicket = carousel.querySelector('.ticket');
        if (firstTicket && originalTicketCount > 0) {
            const ticketWidth = firstTicket.offsetWidth;
            const computedStyle = window.getComputedStyle(carousel);
            const gap = parseFloat(computedStyle.gap) || 0;
            const singleSetWidth = (ticketWidth + gap) * originalTicketCount;

            // Adjust position to stay within bounds
            if (position >= singleSetWidth) {
                position = position % singleSetWidth;
            }
        }
    }, 150);
});

// Start when page loads
window.addEventListener('load', init);
