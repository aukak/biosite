const enterScreen = document.getElementById('enterScreen');
const navbar = document.getElementById('navbar');
const bgAudio = document.getElementById('bgAudio');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const volume = document.getElementById('volume');
const mute = document.getElementById('mute');
bgAudio.volume = volume.value;
enterScreen.addEventListener('click', () => {
bgAudio.play().catch(() => {});
enterScreen.classList.add('hide');
setTimeout(() => {
navbar.classList.add('show');
pages[0].classList.add('active');
}, 400);
});
navLinks.forEach(link => {
link.addEventListener('click', e => {
e.preventDefault();
const targetId = link.getAttribute('href').substring(1);
navLinks.forEach(l => l.classList.remove('active'));
pages.forEach(page => page.classList.remove('active'));
link.classList.add('active');
setTimeout(() => {
document.getElementById(targetId).classList.add('active');
}, 50);
});
});
volume.addEventListener('input', () => {
bgAudio.muted = false;
bgAudio.volume = volume.value;
});
mute.addEventListener('click', () => {
bgAudio.muted = !bgAudio.muted;
});
