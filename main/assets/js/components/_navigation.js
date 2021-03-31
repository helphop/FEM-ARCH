const navbar = document.querySelector('.nav-bar');
const navIcon = document.querySelector('.nav-icon');

navIcon.addEventListener('click', () => {
  navbar.classList.toggle('open');
})