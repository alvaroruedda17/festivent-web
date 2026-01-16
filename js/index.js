// ---Botones del Carrusel---
const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--next');
const prevButton = document.querySelector('.carousel__button--prev');

let currentIndex = 0;

const updateCarousel = () => {
    const trackContainerWidth = document.querySelector('.carousel__track-container').offsetWidth;

    track.style.transform = `translateX(-${currentIndex * trackContainerWidth}px)`;
};

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
});

setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
}, 8000);

window.addEventListener('resize', updateCarousel);

// ---Validación del correo del formulario de la página principal---
const emailInput = document.getElementById('emailInput');
const validationIcon = document.getElementById('validationIcon');
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|live|icloud|yahoo)\.(com|es)$/i;

emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();

    if (value === "") {
        emailInput.classList.remove('newsletter__input--error', 'newsletter__input--success');
        validationIcon.className = 'newsletter__icon';
        
        return
    }

    if (emailRegex.test(value)) {
        emailInput.classList.remove('newsletter__input--error');
        emailInput.classList.add('newsletter__input--success');
        validationIcon.className = 'newsletter__icon newsletter__icon--success';
    } else {
        emailInput.classList.remove('newsletter__input--success');
        emailInput.classList.add('newsletter__input--error');
        validationIcon.className = 'newsletter__icon newsletter__icon--error'
    }
});

// ---PopUp con mensaje de Enviado para el formulario de la página principal---
const newsletterForm = document.getElementById('newsletterForm');
const toast = document.getElementById('toast');
const closeToast = document.getElementById('closeToast');
let toastTimeout;

const hideToast = () => {
    toast.classList.remove('toast--show');
    clearTimeout(toastTimeout);
};

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (emailInput.classList.contains('newsletter__input--success')) {
        toast.classList.add('toast--show');

        newsletterForm.reset();
        emailInput.classList.remove('newsletter__input--success');
        validationIcon.className = 'newsletter__icon';

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(hideToast, 5000);
    } else {
        alert("Por favor, introduce un correo válido primero.");
    }
});

closeToast.addEventListener('click', hideToast);