document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('festival-search');
    const cards = document.querySelectorAll('.info-card');

    // --- LÓGICA DE FILTRADO ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        cards.forEach(card => {
            const festivalName = card.getAttribute('data-name');
            
            // Si el nombre incluye el texto buscado, se muestra, si no, se oculta
            if (festivalName.includes(searchTerm)) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
                // Si la tarjeta oculta estaba abierta, la cerramos
                card.classList.remove('is-active');
            }
        });
    });

    // --- LÓGICA DE ACORDEÓN (Desplegable) ---
    cards.forEach(card => {
        const btn = card.querySelector('.info-card__btn');

        btn.addEventListener('click', () => {
            const isActive = card.classList.contains('is-active');

            // OPCIONAL: Cerrar otras tarjetas al abrir una nueva
            cards.forEach(c => c.classList.remove('is-active'));

            // Si no estaba activa, la abrimos
            if (!isActive) {
                card.classList.add('is-active');
            }
        });
    });
});