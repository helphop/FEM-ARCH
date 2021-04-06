const slideNav = document.querySelector('.slide-nav');

slideNav.addEventListener('click', (event) => {
  document.querySelector('.btn--number--current').classList.remove('btn--number--current');
  event.target.classList.add('btn--number--current');
})


//need start of scroll and end of scroll
// const slider = document.querySelector('.slides');
// const carousel = document.querySelector('.carousel');

// let touchstartX = 0;
// let touchendX = 0;

// carousel.style.cssText = `
//                          width:100%;
//                          height: 100%;
//                          display: grid;
//                          grid-template: 1fr / 100%;
//                          position: relative;
//                          justify-items = start;
//                          overflow: hidden;
//                         `;



// function handleGesture() {
//   // if (touchendX < touchstartX) alert('swiped left!');
//   //swiped to the right move the last element to the start
//   if (touchendX > touchstartX) {
//     slider.prepend(slider.lastElementChild);
//     // carousel.style.justifyItems = 'start';
//   }
//   //swiped to the left move the first element to the end
//   if (touchendX < touchstartX) {
//     slider.appendChild(slider.firstElementChild);
//     // carousel.style.justifyItems = 'end';
//   }
// }


// slider.addEventListener('touchstart', e => {
//   touchstartX = e.changedTouches[0].screenX;
// });

// slider.addEventListener('touchend', e => {
//   touchendX = e.changedTouches[0].screenX;
//   handleGesture();
// });