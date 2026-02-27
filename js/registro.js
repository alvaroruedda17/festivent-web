const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('regEmail');
const passInput = document.getElementById('regPass');
const passConfirm = document.getElementById('regPassConfirm');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// Elementos del Modal
const modal = document.getElementById('confirmModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|live|icloud|yahoo)\.(com|es)$/i;

// ---Validación de Fuerza de Contraseña---
passInput.addEventListener('input', () => {
    const val = passInput.value;
    let strength = 0;

    if (val.length > 5) strength++;
    if (val.match(/[0-9]/)) strength++;
    if (val.match(/[A-Z]/)) strength++;
    if (val.match(/[^a-zA-Z0-9]/)) strength++;

    const colors = ['#ff1744', '#ff1744', '#ffea00', '#00c853', '#00e5ff'];
    const labels = ['Muy Débil', 'Fácil', 'Medio', 'Difícil', 'Nivel Dios'];

    strengthBar.style.width = (strength * 25) + '%';
    strengthBar.style.backgroundColor = colors[strength];
    strengthText.innerText = 'Seguridad: ' + labels[strength];
});

// ---Validación de Coincidencia de Contraseñas---
passConfirm.addEventListener('input', () => {
    if (passConfirm.value === passInput.value && passConfirm.value !== "") {
        passConfirm.className = 'auth-form__input input--valid';
    } else {
        passConfirm.className = 'auth-form__input input--invalid';
    }
});

// ---Validación del Correo Electrónico---
emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();
    const wrapper = emailInput.closest('.input-wrapper');
    const icon = wrapper.querySelector('.val-icon');

    if (value === "") {
        emailInput.classList.remove('input--valid', 'input--invalid');
        if (icon) icon.innerHTML = "";
        return;
    }

    if (emailRegex.test(value)) {
        emailInput.classList.remove('input--invalid');
        emailInput.classList.add('input--valid');
        if (icon) {
            icon.innerHTML = "✓";
            icon.style.color = "#00c853";
        }
    } else {
        emailInput.classList.remove('input--valid');
        emailInput.classList.add('input--invalid');
        if (icon) {
            icon.innerHTML = "✕";
            icon.style.color = "#ff1744";
        }
    }
});

// --- Validación de campos tarjeta de crédito ---
const cardInput = document.getElementById('regCardNumber');
cardInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += " ";
        formattedValue += value[i];
    }
    e.target.value = formattedValue;
});

const holderInput = document.getElementById('regCardHolder');
holderInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

const expiryInput = document.getElementById('regCardExpiry');
expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
        e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        e.target.value = value;
    }
});

const cvvInput = document.getElementById('regCardCVV');
cvvInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// --- LÓGICA DEL MODAL Y ENVÍO ---
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = emailRegex.test(emailInput.value.trim());
    const doPassWordsMatch = passInput.value === passConfirm.value && passInput.value !== "";

    if (isEmailValid && doPassWordsMatch) {
        // Si todo es válido, mostramos el modal en lugar de redirigir directamente
        modal.classList.add('modal--show');
    } else {
        alert('¡Oye! Revisa bien los campos, algo no encaja en tu acreditación.');
    }
});

// Botón "VOLVER" del modal
cancelBtn.addEventListener('click', () => {
    modal.classList.remove('modal--show');
});

// Botón "CONFIRMAR" del modal
confirmBtn.addEventListener('click', () => {
    modal.classList.remove('modal--show');
    localStorage.setItem('showWelcome', 'true');
    window.location.href = '../index.html';
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('modal--show');
    }
});