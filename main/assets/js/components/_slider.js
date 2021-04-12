const slideNav = document.querySelector('.slide-nav');
const slider = document.querySelector('.slider');
const carousel = document.querySelector('.carousel');
const carouselWidth = carousel.offsetWidth;
const numSlides = slider.childElementCount;
const container = document.querySelector('.container-outer');
let loopTimes = 0;
let touchstartX = 0;
let touchendX = 0;
let translateAmount = 100/numSlides; //how far to move the slides
let direction = 'left'; //set initial direction
let currentSlide = document.getElementById('slide1'); //set initial slide


carousel.style.cssText = `
                         width:100%;
                         height: 100%;
                         display: grid;
                         grid-template: 1fr / 100%;
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


//FUNCTIONS -----------------------------------------------------------------------------------

//set the current button to match the current slide
//when resize from mobile screen size to desktop
function resetCarousel() {
  if (container.offsetWidth > 1024) setCurrentButton(getButtonForSlide(currentSlide.id));
}

function setCurrentButton(button) {
  document.querySelector('.btn--number--current').classList.remove('btn--number--current');
  button.classList.add('btn--number--current');
}

function getButtonForSlide(id) {
  return document.querySelector(`[data-slide="${id}"]`);
}

function handleGesture() {
  //swiped to the left
  if (touchendX < touchstartX) {
    slideleft();
  }
  //swiped to the right
  else {
    slideright();
  }
}

function slideleft() {
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

function slideright() {
  //check if the previous slide was to the left
  if (direction === 'left') {
    slider.appendChild(slider.firstElementChild);
    //move the carousel to the end of the row
    carousel.style.justifyItems = 'end';
  }
  direction = 'right';
  slider.style.transform = `translateX(${translateAmount}%)`;
}

function setCurrentSlide() {
  for (let i = 0; i < numSlides; i++) {
    if (isInViewport(slider.children[i], carousel)) {
      currentSlide = slider.children[i];
      break;
    }
  }
}

function loopSlides(direction) {
    if (loopTimes > 1) {
    eval(`slide${direction}()`);
    loopTimes--;
  }
}


//EVENT LISTENERS-------------------------------------------------------------------

//listen for slide button clicks
slideNav.addEventListener('click', (event) => {
  button = event.target;
  buttonId = lastChar(button.getAttribute('data-slide'));
  slideId = lastChar(currentSlide.id);

  //determines the direction to move the slider
  slideAmount = parseInt(slideId) - parseInt(buttonId);

  //determines the number of times the slider must move
  loopTimes = Math.abs(slideAmount)

  if (slideAmount < 0) {
    slideleft();
  } else if (slideAmount > 0){
    slideright();
  }

  //change the color of the clicked button
  setCurrentButton(button);
})

//listen for finger gesture start
slider.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
});

//listen for finger gesture end
slider.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});

//listen for when the slide has finished moving
slider.addEventListener('transitionend', function() {

  //makes the slider seem infinite
  if (direction === 'right') {
    //move the last element to the start
    slider.prepend(slider.lastElementChild);
  } else {
    //move the first element to the end
    slider.appendChild(slider.firstElementChild);
  }

  //stops animating when the transition is put back to 0
  slider.style.transition = 'none';
  //reset the slider element to the starting position
  slider.style.transform = 'translate(0)';
  //set the slide that is now showing in the viewport
  setCurrentSlide();

  //delay the setting of the transition and calling the slide function when sliding more than 1 slide
  setTimeout(() => {
    //add back the animation of the slider
    slider.style.transition = 'all 0.5s';
    //loop moving the slider to get requested slide.  Works when buttons are clicked.
    loopSlides(direction)
  })

}, false);

window.addEventListener("resize",debounce(resetCarousel));

