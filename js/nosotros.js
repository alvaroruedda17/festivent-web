const video = document.getElementById('festivideo');
const langButtons = document.querySelectorAll('.control-btn');

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        const tracks = video.textTracks;

        langButtons.forEach(btn => btn.classList.remove('control-btn--active'));
        button.classList.add('control-btn--active');

        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].language === lang) {
                tracks[i].mode = 'showing';
            } else {
                tracks[i].mode = 'disabled';
            }
            
        }
    });
});