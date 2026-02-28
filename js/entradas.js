document.addEventListener('DOMContentLoaded', () => {
    // 1. DATOS
    const festivalData = {
        techno: ["Awakenings Madrid", "Sónar Barcelona", "Dreambeach"],
        rap: ["Madrid Salvaje", "Viña Rock", "Rocanrola"],
        trap: ["Riverland Festival", "Puro Latino", "Zevra Festival"]
    };

    // 2. ELEMENTOS
    const loader = document.getElementById('loader-wrapper');
    const form = document.getElementById('ticket-form');
    const genreSelect = document.getElementById('genre');
    const festSelect = document.getElementById('festival');
    const consoleOutput = document.getElementById('console-output');
    const finalPriceDisplay = document.getElementById('final-price');
    const successModal = document.getElementById('success-msg');
    const animatedElements = document.querySelectorAll('.animate-on-load');

    // --- ANIMACIÓN DE ENTRADA ---
    setTimeout(() => {
        animatedElements.forEach((el, index) => {
            setTimeout(() => el.classList.add('is-visible'), index * 200);
        });
    }, 100);

    // --- CANVAS DE PARTÍCULAS ---
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const colors = ['#6C63FF', '#FF3CAC', '#FFD600'];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 1.5 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y -= this.speed;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 120 }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // --- LÓGICA DE FORMULARIO (Único Listener) ---
    genreSelect.addEventListener('change', () => {
        const selectedGenre = genreSelect.value;
        const festivals = festivalData[selectedGenre];

        if (festivals) {
            festSelect.innerHTML = '<option value="" disabled selected>-- Elige tu festival --</option>';
            festivals.forEach(fest => {
                const option = document.createElement('option');
                option.value = fest.toLowerCase().replace(/\s/g, '_'); 
                option.textContent = fest;
                festSelect.appendChild(option);
            });
            festSelect.disabled = false;
            updateSummary();
        }
    });

    function updateSummary() {
        const genre = genreSelect.options[genreSelect.selectedIndex]?.text || "---";
        const fest = festSelect.options[festSelect.selectedIndex]?.text || "---";
        const qty = document.getElementById('quantity').value;
        const type = document.querySelector('input[name="ticket-type"]:checked');
        const addons = document.querySelectorAll('input[name="addon"]:checked');

        let total = parseFloat(type.dataset.price);
        let addonsNames = [];
        addons.forEach(a => {
            total += parseFloat(a.dataset.price);
            addonsNames.push(a.parentElement.textContent.trim().split(' (')[0]);
        });

        const finalTotal = total * qty;
        finalPriceDisplay.textContent = `${finalTotal.toFixed(2)}€`;

        consoleOutput.innerHTML = `
            <p class="console__line">> Estilo: <span class="console__line--val">${genre}</span></p>
            <p class="console__line">> Evento: <span class="console__line--val">${fest}</span></p>
            <p class="console__line">> Cantidad: <span class="console__line--val">${qty}</span></p>
            <p class="console__line">> Pase: <span class="console__line--val">${type.value.toUpperCase()}</span></p>
            <p class="console__line">> Extras: <span class="console__line--val">${addonsNames.length ? addonsNames.join(', ') : 'Ninguno'}</span></p>
            <p class="console__line--success">> Sistema listo para compra.</p>
        `;
    }

    form.addEventListener('input', updateSummary);

    // --- PROCESO DE COMPRA ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loader.classList.add('is-active'); 

        setTimeout(() => {
            loader.classList.remove('is-active'); 
            successModal.classList.add('success-msg--active');
        }, 1500);
    });

    // --- RESET FORMULARIO ---
    window.resetForm = () => {
        successModal.classList.remove('success-msg--active');
        form.reset();
        festSelect.disabled = true;
        festSelect.innerHTML = '<option value="" disabled selected>-- Primero elige un estilo --</option>';
        finalPriceDisplay.textContent = "0.00€";
        consoleOutput.innerHTML = '<p class="console__line">> Esperando selección...</p>';
    };

    // --- LÓGICA DE AUTO-RELLENADO DESDE URL (Al final) ---
    const urlParams = new URLSearchParams(window.location.search);
    const genreParam = urlParams.get('genre');
    const festParam = urlParams.get('festival');

    if (genreParam) {
        genreSelect.value = genreParam;
        genreSelect.dispatchEvent(new Event('change'));

        if (festParam) {
            // Un pequeño delay asegura que las opciones se hayan renderizado
            setTimeout(() => {
                festSelect.value = festParam;
                updateSummary();
            }, 100);
        }
    }
});