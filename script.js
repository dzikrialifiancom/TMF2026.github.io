// Utility to safe-check and run initializations
const onReady = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
};

onReady(() => {
    // 1. Third-Party Libraries Setup
    AOS.init({ duration: 1000, once: true, offset: 100 });

    if (document.querySelector(".glass-card")) {
        VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 20, speed: 400, glare: true, "max-glare": 0.4, scale: 1.05
        });
    }

    if (document.getElementById('typewriter-text')) {
        new Typed('#typewriter-text', {
            strings: ['Carving Melodies Weaving Stories'],
            typeSpeed: 50, backSpeed: 25, loop: true, backDelay: 2000
        });
    }

    // 2. Site Lock & Explore Feature
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        document.body.classList.add('noscroll');
        exploreBtn.classList.remove('d-none');
        exploreBtn.addEventListener('click', () => {
            document.body.classList.remove('noscroll');
            exploreBtn.classList.add('d-none');
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 3. Countdown Timer
    const targetDate = new Date("January 1, 2026 19:00:00").getTime();
    const updateCountdown = () => {
        const distance = targetDate - new Date().getTime();
        const display = document.getElementById("countdown-timer");
        if (!display) return;

        if (distance < 0) {
            display.innerHTML = "<div class='glass-panel p-3'><h3>The Festival Has Begun!</h3></div>";
            return;
        }

        const units = {
            Days: Math.floor(distance / 86400000),
            Hours: Math.floor((distance % 86400000) / 3600000),
            Minutes: Math.floor((distance % 3600000) / 60000),
            Seconds: Math.floor((distance % 60000) / 1000)
        };

        display.innerHTML = Object.entries(units).map(([label, value]) => `
            <div class="countdown-item text-center">
                <span class="countdown-number">${value}</span>
                <span class="countdown-label">${label}</span>
            </div>
        `).join('');
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. Performer Modal
    const performerModal = document.getElementById('performerModal');
    if (performerModal) {
        performerModal.addEventListener('show.bs.modal', e => {
            const data = performersData[e.relatedTarget.getAttribute('data-performer-id')];
            if (!data) return;

            performerModal.querySelector('#performerModalTitle').textContent = data.title;
            performerModal.querySelector('#performerModalDesc').textContent = data.desc;

            const carousel = performerModal.querySelector('#carouselInner');
            carousel.innerHTML = data.gallery.map((src, i) => `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <img src="${src}" class="d-block w-100 rounded" alt="Gallery ${i + 1}" style="height: 350px; object-fit: cover;">
                </div>
            `).join('');
        });
    }

    // 5. Calendar & Directions
    document.getElementById('get-directions')?.addEventListener('click', () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Pondok Modern Darussalam Gontor")}`, '_blank');
    });

    document.getElementById('add-to-calendar')?.addEventListener('click', () => {
        const text = encodeURIComponent("Teacher Music Festival 2025");
        const dates = "20260101T120000Z/20260101T160000Z";
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=Gontor`, '_blank');
    });

    // 6. Guestbook (Comments)
    loadComments();
});

// Performer Data & Comments Logic (Kept separate for clarity)
const performersData = {
    "grade1": { title: "First Grade Teacher", gallery: ["images/perf_conductor.png", "images/perf_violin.png", "images/perf_piano.png"], desc: "The First Grade Teachers open our symphony with vibrant energy..." },
    "grade2": { title: "Second Grade Teacher", gallery: ["images/perf_violin.png", "images/perf_conductor.png", "images/performer.png"], desc: "Our Second Grade Teachers build the rhythm of our festival..." },
    "grade3": { title: "Third Grade Teacher", gallery: ["images/perf_piano.png", "images/perf_violin.png", "images/perf_conductor.png"], desc: "Harmonizing the collective song, the Third Grade Teachers..." },
    "grade4": { title: "Fourth Grade Teacher", gallery: ["images/performer.png", "images/perf_piano.png", "images/perf_violin.png"], desc: "Providing the core melody, Fourth Grade Teachers guide students..." },
    "grade5": { title: "Fifth Grade Teacher", gallery: ["images/perf_conductor.png", "images/performer.png", "images/perf_piano.png"], desc: "A crescendo of talent! Fifth Grade Teachers prepare students..." },
    "grade6": { title: "Sixth Grade Teacher", gallery: ["images/perf_violin.png", "images/perf_conductor.png", "images/performer.png"], desc: "Delivering a masterful performance, Sixth Grade Teachers..." },
    "grade7": { title: "Seventh Grade Teacher", gallery: ["images/perf_piano.png", "images/perf_violin.png", "images/perf_conductor.png"], desc: "Refining the art of teaching, our Seventh Grade educators..." },
    "grade8": { title: "Eighth Grade Teacher", gallery: ["images/performer.png", "images/perf_piano.png", "images/perf_violin.png"], desc: "The grand finale! Eighth Grade Teachers prepare our students..." }
};

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz0JPpfXjUCZ2FkMsj05UOfbp-RxgasBWmLqwTSJy8UpBt7hNmAUMZg_igVi-Y1WTbk/exec";

async function loadComments() {
    const display = document.getElementById('comments-display');
    if (!display || !SHEETS_URL) return;
    try {
        const response = await fetch(SHEETS_URL);
        const data = await response.json();
        display.innerHTML = data.length ? data.map(c => `
            <div class="comment-card">
                <div class="comment-header">
                    <span class="comment-name">${c.name}</span>
                    <span class="comment-date">${new Date(c.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="comment-message">${c.message}</div>
            </div>
        `).join('') : '<div class="text-center text-muted">No wishes yet. Be the first!</div>';
    } catch {
        display.innerHTML = '<div class="text-center text-danger">Failed to load wishes.</div>';
    }
}

document.getElementById('comment-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Sending..."; btn.disabled = true;

    try {
        await fetch(SHEETS_URL, {
            method: "POST",
            body: JSON.stringify({ name: this.name.value, message: this.message.value }),
            mode: "no-cors"
        });
        btn.innerText = "Sent!";
        setTimeout(() => { this.reset(); btn.innerText = originalText; btn.disabled = false; loadComments(); }, 2000);
    } catch {
        btn.innerText = "Error"; btn.disabled = false;
    }
});
