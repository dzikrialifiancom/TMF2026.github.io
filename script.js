// Initialize AOS Animation Library
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Vanilla Tilt for Anti-Gravity Effect
// Targeting all elements with .glass-card class
VanillaTilt.init(document.querySelectorAll(".glass-card"), {
    max: 25,            // Increased tilt rotation for more "interactive" feel
    speed: 400,         // Speed of the enter/exit transition
    glare: true,        // Add a glare effect
    "max-glare": 0.5,   // Increased glare opacity
    scale: 1.1          // Increased scale for better hover feedback
});

// Initialize Typed.js for Hero Section
new Typed('#typewriter-text', {
    strings: ['Carving Melodies Weaving Stories'],
    typeSpeed: 50,
    backSpeed: 25,
    showCursor: true,
    cursorChar: '|',
    loop: true,
    backDelay: 2000
});

// Countdown Timer Logic
const targetDate = new Date("January 1, 2026 19:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById("countdown-timer").innerHTML = "<div class='glass-panel p-3'><h3>The Festival Has Begun!</h3></div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const timerHTML = `
        <div class="countdown-item text-center">
            <span class="countdown-number">${days}</span>
            <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item text-center">
            <span class="countdown-number">${hours}</span>
            <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item text-center">
            <span class="countdown-number">${minutes}</span>
            <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item text-center">
            <span class="countdown-number">${seconds}</span>
            <span class="countdown-label">Seconds</span>
        </div>
    `;

    document.getElementById("countdown-timer").innerHTML = timerHTML;
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Run immediately

// Add to Google Calendar Logic
document.getElementById('add-to-calendar').addEventListener('click', function () {
    const eventName = encodeURIComponent("Teacher Music Festival 2025");
    const eventDates = "20260101T120000Z/20260101T160000Z"; // UTC time (19:00 WIB is 12:00 UTC)
    const eventDetails = encodeURIComponent("Join us for the Teacher Music Festival 2025 at Pondok Modern Darussalam Gontor.");
    const eventLocation = encodeURIComponent("Pondok Modern Darussalam Gontor");

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${eventDates}&details=${eventDetails}&location=${eventLocation}`;

    window.open(calendarUrl, '_blank');
});

// Get Directions Logic
document.getElementById('get-directions').addEventListener('click', function () {
    const destination = encodeURIComponent("Pondok Modern Darussalam Gontor");
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
});

// Google Sheets Backend URL
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz0JPpfXjUCZ2FkMsj05UOfbp-RxgasBWmLqwTSJy8UpBt7hNmAUMZg_igVi-Y1WTbk/exec";

// Load Comments
async function loadComments() {
    if (!SHEETS_URL) return;

    const display = document.getElementById('comments-display');
    try {
        const response = await fetch(SHEETS_URL);
        const data = await response.json();

        display.innerHTML = ''; // Clear loading

        if (data.length === 0) {
            display.innerHTML = '<div class="text-center text-muted">No wishes yet. Be the first!</div>';
            return;
        }

        data.forEach(comment => {
            const date = new Date(comment.timestamp).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const card = `
                <div class="comment-card">
                    <div class="comment-header">
                        <span class="comment-name">${comment.name}</span>
                        <span class="comment-date">${date}</span>
                    </div>
                    <div class="comment-message">${comment.message}</div>
                </div>
            `;
            display.innerHTML += card;
        });

    } catch (error) {
        console.error("Error loading comments:", error);
        display.innerHTML = '<div class="text-center text-danger">Failed to load wishes.</div>';
    }
}

// Initial Load
loadComments();

// Comment Form Submission
document.getElementById('comment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!SHEETS_URL) {
        alert("Please set up the Google Sheets Backend URL in script.js!");
        return;
    }

    const btn = this.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const originalText = btn.innerText;

    btn.innerText = "Sending...";
    btn.disabled = true;

    const payload = JSON.stringify({
        name: nameInput.value,
        message: messageInput.value
    });

    fetch(SHEETS_URL, {
        method: "POST",
        body: payload,
        mode: "no-cors", // Important for Google Apps Script Web App
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        btn.innerText = "Sent!";
        btn.classList.remove('btn-glass');
        btn.classList.add('btn-success');
        btn.style.backgroundColor = "#064e3b";

        // Reload comments to show new one (simulated delay for propagation)
        setTimeout(loadComments, 1000);

        setTimeout(() => {
            this.reset();
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.add('btn-glass');
            btn.classList.remove('btn-success');
            btn.style.backgroundColor = "";
        }, 2000);
    }).catch(error => {
        console.error("Error!", error.message);
        btn.innerText = "Error";
        btn.disabled = false;
    });
});

// Performer Data
const performersData = {
    "grade1": {
        title: "First Grade Teacher",
        gallery: ["images/perf_conductor.png", "images/perf_violin.png", "images/perf_piano.png"],
        desc: "The First Grade Teachers open our symphony with vibrant energy. Their performance captures the innocent curiosity and boundless potential of our youngest students. Like a conductor leading an orchestra for the first time, they guide these new minds with patience and enthusiasm, setting the tempo for a lifelong journey of learning."
    },
    "grade2": {
        title: "Second Grade Teacher",
        gallery: ["images/perf_violin.png", "images/perf_conductor.png", "images/performer.png"],
        desc: "Our Second Grade Teachers build the rhythm of our festival. With steady dedication, they nurture the foundational skills, adding complexity and depth to the initial melodies. Their performance serves as a bridge, connecting early discovery with structured understanding, much like a violin section holding the core rhythm of a piece."
    },
    "grade3": {
        title: "Third Grade Teacher",
        gallery: ["images/perf_piano.png", "images/perf_violin.png", "images/perf_conductor.png"],
        desc: "Harmonizing the collective song, the Third Grade Teachers bring a sophisticated layer to our education symphony. They encourage students to listen to each other, fostering collaboration and empathy. Their musical tribute reflects the beauty of diverse voices coming together to create a unified, beautiful sound."
    },
    "grade4": {
        title: "Fourth Grade Teacher",
        gallery: ["images/performer.png", "images/perf_piano.png", "images/perf_violin.png"],
        desc: "Providing the core melody, Fourth Grade Teachers guide students through more complex compositions of knowledge. They challenge students to find their own voice within the chorus. This performance is a testament to the strength and resilience developed during these crucial middle years."
    },
    "grade5": {
        title: "Fifth Grade Teacher",
        gallery: ["images/perf_conductor.png", "images/performer.png", "images/perf_piano.png"],
        desc: "A crescendo of talent! Fifth Grade Teachers prepare students for the leap to higher challenges. Their segment is dynamic and powerful, symbolizing the confidence and leadership skills they instill. It is a celebration of growth, marking the transition from childhood curiosity to pre-adolescent capability."
    },
    "grade6": {
        title: "Sixth Grade Teacher",
        gallery: ["images/perf_violin.png", "images/perf_conductor.png", "images/performer.png"],
        desc: "Delivering a masterful performance, Sixth Grade Teachers represent the refinement of skill and character. They guide students through the complexities of adolescence with grace and wisdom. Their music speaks of mentorship, guidance, and the delicate balance of freedom and responsibility."
    },
    "grade7": {
        title: "Seventh Grade Teacher",
        gallery: ["images/perf_piano.png", "images/perf_violin.png", "images/perf_conductor.png"],
        desc: "Refining the art of teaching, our Seventh Grade educators help students polish their intellectual and emotional understanding. Like a virtuoso pianist, they demonstrate technical mastery and emotional depth, encouraging students to strive for excellence in every endeavor."
    },
    "grade8": {
        title: "Eighth Grade Teacher",
        gallery: ["images/performer.png", "images/perf_piano.png", "images/perf_violin.png"],
        desc: "The grand finale! Eighth Grade Teachers prepare our students for the world beyond. Their performance is a powerful conclusion to this chapter of education, leaving a lasting impact that resonates long after the final note. It is a send-off filled with hope, pride, and the promise of a bright future."
    }
};

// Performer Modal Logic
const performerModal = document.getElementById('performerModal');
if (performerModal) {
    performerModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const id = button.getAttribute('data-performer-id');
        const data = performersData[id];

        if (!data) return;

        // Update Title and Description
        performerModal.querySelector('#performerModalTitle').textContent = data.title;
        performerModal.querySelector('#performerModalDesc').textContent = data.desc;

        // Generate Carousel
        const carouselInner = performerModal.querySelector('#carouselInner');
        carouselInner.innerHTML = ''; // Clear previous

        data.gallery.forEach((imgSrc, index) => {
            const div = document.createElement('div');
            div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            div.innerHTML = `<img src="${imgSrc}" class="d-block w-100 rounded" alt="Gallery Image ${index + 1}" style="height: 350px; object-fit: cover;">`;
            carouselInner.appendChild(div);
        });
    });
}

// Site Lock Logic (Every Visit)
document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('explore-btn');

    // Always lock on load
    document.body.classList.add('noscroll');
    if (exploreBtn) {
        exploreBtn.classList.remove('d-none');

        exploreBtn.addEventListener('click', () => {
            document.body.classList.remove('noscroll');
            exploreBtn.classList.add('d-none'); // Hide button after unlocking

            // Scroll to About section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
