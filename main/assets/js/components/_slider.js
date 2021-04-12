const slideNav = document.querySelector('.slide-nav');
const slider = document.querySelector('.slider');
const carousel = document.querySelector('.carousel');
const carouselWidth = carousel.offsetWidth;
const numSlides = slider.childElementCount;
const container = document.querySelector('.container-outer');
let touchstartX = 0;
let touchendX = 0;
let translateAmount = 100/numSlides; //how far to move the slides
let direction = 'left'; //set initial direction
let currentSlide = document.getElementById('slide1');

carousel.style.cssText = `
                         width:100%;
                         height: 100%;
                         display: grid;
                         grid-template: 1fr / 100%;
                         position: relative;
                         justify-items: start;
                         overflow: hidden;
                         `;

slider.style.cssText = `
                      height: 100%;
                      width: ${numSlides * 100}%;
                      display: grid;
                      grid-template-columns: repeat(${numSlides}, ${1/numSlides}fr);
                      transition: all 0.5s;
                      `;

function reOrderSlides() {
  const slides = [...slider.children];
  slides.sort((a,b) => a.id.charAt(a.id.length-1) - b.id.charAt(b.id.length-1))
  slides.forEach(slide => slider.appendChild(slide));
}

function resetCarousel() {
  if (container.offsetWidth > 1024) {
    reOrderSlides();
    setCurrentButton(getCurrentButton(currentSlide.id));
  }
}

function setCurrentButton(button) {
    document.querySelector('.btn--number--current').classList.remove('btn--number--current');
    button.classList.add('btn--number--current');
}

function getCurrentButton(id) {
  return document.querySelector(`[data-slide="${id}"]`);
}

function handleGesture() {
  //swiped to the left
  if (touchendX < touchstartX) {
    slideLeft();
  }
  //swiped to the right
  else if (touchendX > touchstartX) {
    slideRight();
  }
}

function slideLeft() {
    if (direction === 'right') {
      //must move the last slide to the start and shift the carousel to the end of the row.
      slider.prepend(slider.lastElementChild);
      //move the carousel to the start of the row
      carousel.style.justifyItems = 'start';
    }
    //set the direction we are now moving
    direction = 'left';
    //move the slider to the left
    slider.style.transform = `translateX(-${translateAmount}%)`;
}

function slideRight() {
    //check if the previous slide was to the left
    if (direction === 'left') {
      slider.appendChild(slider.firstElementChild);
      //move the carousel to the end of the row
      carousel.style.justifyItems = 'end';
    }
    direction = 'right';
    slider.style.transform = `translateX(${translateAmount}%)`;
}

//slow down the window resize listener
function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,200,event);
  };
}

function setCurrentSlide() {
  let slide = null;
  for (let i = 0; i < numSlides; i++) {
    if (isInViewport(slider.children[i])) {
      slide = slider.children[i];
      break;
    }
  }
  currentSlide = slide;
}

const isInViewport = (element) =>  (element.getBoundingClientRect().left === carousel.getBoundingClientRect().left);

slideNav.addEventListener('click', (event) => {
  button = event.target.getAttribute('data-slide');
  buttonId = parseInt(button.charAt(button.length - 1));
  slideId = parseInt(currentSlide.id.charAt(currentSlide.id.length - 1));
  slideAmount = slideId - buttonId;
  console.log(slideAmount);
  if (slideAmount < 0) {
    slideLeft();
  } else if (slideAmount > 0){
    slideRight();
  }
  setCurrentButton(event.target);
})


slider.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});

slider.addEventListener('transitionend', function() {

  if (direction === 'right') {
      //move the last element to the start
      slider.prepend(slider.lastElementChild);
    } else {
      //move the first element to the end
      slider.appendChild(slider.firstElementChild);
    }

  //stops animating the transition back to 0
  slider.style.transition = 'none';
  //reset the slider element to the starting position
  slider.style.transform = 'translate(0)';

  //set the name of the slide in the viewport
  setCurrentSlide();
  //delay the setting of the transition
  setTimeout(function() {
    //add back the animation of the slider
    slider.style.transition = 'all 0.5s';
  })

}, false);

window.addEventListener("resize",debounce(resetCarousel));

window.addEventListener('DOMContentLoaded', (event) => {
  setCurrentButton(getCurrentButton(currentSlide.id));
});