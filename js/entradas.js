document.addEventListener('DOMContentLoaded', () => {
    // 1. BASE DE DATOS ESTRUCTURADA (Simulación de API)
    const festivalData = {
        techno: ["Awakenings Madrid", "Sónar Barcelona", "Dreambeach"],
        rap: ["Madrid Salvaje", "Viña Rock", "Rocanrola"],
        trap: ["Riverland Festival", "Puro Latino", "Zevra Festival"]
    };

    // 2. ELEMENTOS DEL DOM
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const loader = document.getElementById('loader-wrapper');
    const animatedElements = document.querySelectorAll('.animate-on-load');
    const form = document.getElementById('ticket-form');
    const genreSelect = document.getElementById('genre');
    const festSelect = document.getElementById('festival');
    const consoleOutput = document.getElementById('console-output');
    const finalPriceDisplay = document.getElementById('final-price');
    const successModal = document.getElementById('success-msg');

    // --- LÓGICA DEL CANVAS (PARTÍCULAS) ---
    const colors = ['#6C63FF', '#FF3CAC', '#FFD600'];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

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
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 120 }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- LOADER INICIAL ---
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }, 300);
    }, 1500);

    // --- LÓGICA DINÁMICA DE COMPRA ---

    // Filtrado de festivales según género
    genreSelect.addEventListener('change', (e) => {
        const selectedGenre = e.target.value;
        const festivals = festivalData[selectedGenre];

        festSelect.innerHTML = '<option value="" disabled selected>-- Seleccionar Festival --</option>';
        festivals.forEach(fest => {
            const option = document.createElement('option');
            option.value = fest.toLowerCase().replace(/\s/g, '_');
            option.textContent = fest;
            festSelect.appendChild(option);
        });

        festSelect.disabled = false;
        updateConsole();
    });

    // Actualización de Consola y Precio
    const updateConsole = () => {
        const genre = genreSelect.value || "null";
        const fest = festSelect.options[festSelect.selectedIndex]?.text || "undefined";
        const quantity = document.getElementById('quantity').value;
        const ticketType = document.querySelector('input[name="ticket-type"]:checked');
        const addons = document.querySelectorAll('input[name="addon"]:checked');

        let price = parseFloat(ticketType.dataset.price);
        let addonsPrice = 0;
        let addonsList = [];

        addons.forEach(addon => {
            addonsPrice += parseFloat(addon.dataset.price);
            addonsList.push(addon.value);
        });

        const total = (price + addonsPrice) * quantity;
        finalPriceDisplay.textContent = `${total.toFixed(2)}€`;

        // Inyectar texto estilo código en la consola
        consoleOutput.innerHTML = `
            <p class="console__line">> Initializing deployment...</p>
            <p class="console__line">> Environment: <span class="console__line--val">"${genre}"</span></p>
            <p class="console__line">> Target: <span class="console__line--val">"${fest}"</span></p>
            <p class="console__line">> Instances: <span class="console__line--val">${quantity}</span></p>
            <p class="console__line">> Access_Level: <span class="console__line--val">"${ticketType.value}"</span></p>
            <p class="console__line">> Plugins: <span class="console__line--val">[${addonsList.map(a => `'${a}'`).join(', ')}]</span></p>
            <p class="console__line--success">> Ready to deploy.</p>
        `;
    };

    // Listeners para cambios en tiempo real
    form.addEventListener('input', updateConsole);

    // --- PROCESO DE "DEPLOY" (COMPRA) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Mostrar Loader (Simulación de proceso de pago)
        loader.classList.remove('fade-out');
        
        // 2. Timeout de 2 segundos para "realismo"
        setTimeout(() => {
            loader.classList.add('fade-out');
            
            // 3. Mostrar mensaje de éxito
            successModal.classList.add('success-msg--active');
            console.log("Purchase complete: Transaction Hashed.");
        }, 2000);
    });
});