// Sample ticket data
const tickets = [
    {
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        link: 'details.html?movie=1'
    },
    {
        image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
        link: 'details.html?movie=2'
    },
    {
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
        link: 'details.html?movie=3'
    },
    {
        image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400',
        link: 'details.html?movie=4'
    },
    {
        image: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400',
        link: 'details.html?movie=5'
    },
    {
        image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400',
        link: 'details.html?movie=6'
    }
];

// Duplicate tickets for seamless loop
const allTickets = [...tickets, ...tickets, ...tickets];

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

// Create ticket elements
function createTickets() {
    carousel.innerHTML = '';
    allTickets.forEach((ticket, index) => {
        const ticketEl = document.createElement('div');
        ticketEl.className = 'ticket';
        ticketEl.innerHTML = `
            <div class="punch-hole"></div>
            <div class="punch-hole"></div>
            <img src="${ticket.image}" alt="Movie ticket" class="ticket-image">
        `;

        // Add hover listeners
        ticketEl.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        ticketEl.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Add click listener
        ticketEl.addEventListener('click', () => {
            window.location.href = ticket.link;
        });

        carousel.appendChild(ticketEl);
    });
}

// Calculate movement with rotation
function animate() {
    if (!isPaused) {
        // Move along single axis
        position += speed;

        // Calculate dimensions for seamless loop
        const ticketWidth = 320;
        const gap = 1;
        const singleSetWidth = (ticketWidth + gap) * tickets.length;

        // Reset position when one set of tickets has passed for seamless loop
        if (position >= singleSetWidth) {
            position = position - singleSetWidth;
        }

        // Apply transforms: translate to center, rotate, then translate along x-axis for movement
        // The translate(-50%, -50%) centers the carousel at the screen center
        carousel.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg) translateX(${-position}px)`;
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
    createTickets();
    position = 0;
    animate();
}

// Start when page loads
window.addEventListener('load', init);
