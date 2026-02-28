document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DEL CANVAS (PARTÍCULAS) ---
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
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
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- TEMPORIZADOR DEL LOADER ---
    const loader = document.getElementById('loader-wrapper');
    const animatedElements = document.querySelectorAll('.animate-on-load');

    setTimeout(() => {
        // Quitamos el loader
        loader.classList.add('fade-out');
        
        // Iniciamos la animación de la página
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.classList.add('is-visible');
            });
        }, 300); // Pequeño margen tras el fade del loader
    }, 2000); // 2 segundos de carga

    // --- LÓGICA DE SUBTÍTULOS ORIGINAL ---
    const video = document.getElementById('festivideo');
    const langButtons = document.querySelectorAll('.control-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            const tracks = video.textTracks;
            langButtons.forEach(btn => btn.classList.remove('control-btn--active'));
            button.classList.add('control-btn--active');

            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = (tracks[i].language === lang) ? 'showing' : 'disabled';
            }
        });
    });
});