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

    // --- ENTRADA LIMPIA (Sin spinner inicial) ---
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

    // --- LÓGICA DE FORMULARIO ---
    genreSelect.addEventListener('change', () => {
        const festivals = festivalData[genreSelect.value];
        festSelect.innerHTML = '<option value="" disabled selected>-- Selecciona el evento --</option>';
        festivals.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.toLowerCase().replace(/\s/g, '_');
            opt.textContent = f;
            festSelect.appendChild(opt);
        });
        festSelect.disabled = false;
        updateSummary();
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

    // --- PROCESO DE COMPRA (Aquí sí usamos el Spinner) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loader.classList.add('is-active'); // Mostramos spinner

        setTimeout(() => {
            loader.classList.remove('is-active'); // Ocultamos spinner
            successModal.classList.add('success-msg--active');
        }, 1500);
    });

    // --- RESET HUMANO (Sin recarga de página) ---
    window.resetForm = () => {
        successModal.classList.remove('success-msg--active');
        form.reset();
        festSelect.disabled = true;
        festSelect.innerHTML = '<option value="" disabled selected>-- Primero elige un estilo --</option>';
        finalPriceDisplay.textContent = "0.00€";
        consoleOutput.innerHTML = '<p class="console__line">> Esperando selección...</p>';
    };
});