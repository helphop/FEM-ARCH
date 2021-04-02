const slideNav = document.querySelector('.slide-nav');

slideNav.addEventListener('click', (event) => {
  document.querySelector('.btn--number--current').classList.remove('btn--number--current');
  event.target.classList.add('btn--number--current');
})