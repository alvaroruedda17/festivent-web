const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('regEmail');
const passInput = document.getElementById('regPass');
const passConfirm = document.getElementById('regPassConfirm');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

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

// ---EVENTO DE ENVÍO ÚNICO---
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = emailRegex.test(emailInput.value.trim());
    const doPassWordsMatch = passInput.value === passConfirm.value && passInput.value !== "";

    if (isEmailValid && doPassWordsMatch) {
        localStorage.setItem('showWelcome', 'true');
        
        window.location.href = '../index.html';
    } else {
        alert('¡Oye! Revisa bien los campos, algo no encaja en tu acreditación.');
    }
});