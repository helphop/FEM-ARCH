const slideNav = document.querySelector('.slide-nav');

slideNav.addEventListener('click', (event) => {
  document.querySelector('.btn--number--current').classList.remove('btn--number--current');
  event.target.classList.add('btn--number--current');
})


//need start of scroll and end of scroll
const slider = document.querySelector('.slider');
const carousel = document.querySelector('.carousel');
const numSlides = slider.childElementCount;
const container = document.querySelector('.container-outer');

let touchstartX = 0;
let touchendX = 0;
let translateAmount = `${100/numSlides}%`;
let direction = 'left'; //means it is moving to the left

carousel.style.cssText = `
                         width:100%;
                         height: 100%;
                         display: grid;
                         grid-template: 1fr / 100%;
                         position: relative;
                         justify-items: start;
                         overflow-x: scroll;
                         scroll-behavior: smooth;
                         scroll-snap-type: x mandatory;
                        `;

slider.style.cssText = `
                      height: 100%;
                      width: ${numSlides * 100}%;
                      display: grid;
                      grid-template-columns: repeat(${numSlides}, ${1/numSlides}fr);
                      transition: all 0.5s;
                      `;


function handleGesture() {
  //swiped to the left
  if (touchendX < touchstartX) {
      //check if previous slide was to the right
    if (direction === 'right') {
      //must move the last slide to the start and shift the carousel to the end of the row.
      slider.prepend(slider.lastElementChild);
      //move the carousel to the start of the row
      carousel.style.justifyItems = 'start';
    }
    //set the direction we are now moving
    direction = 'left';
    //move the slider to the left
    slider.style.transform = `translateX(-${translateAmount})`;

  }
  //swiped to the right
  else if (touchendX > touchstartX) {
    //check if the previous slide was to the left
    if (direction === 'left') {
      slider.appendChild(slider.firstElementChild);
      //move the carousel to the end of the row
      carousel.style.justifyItems = 'end';
    }
    direction = 'right';
    slider.style.transform = `translateX(${translateAmount})`;
  }
}

function setCarouselScroll() {
  let containerWidth = container.offsetWidth;
  if (containerWidth > 1024) {
    carousel.style.overflowX ='scroll'
    carousel.style.justifyItems = 'start';
    carousel.style.scrollBehavior = 'smooth';
  } else {
    carousel.style.overflowX ='hidden'
  }
}

function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,200,event);
  };
}

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

  //delay the setting of the transition
  setTimeout(function() {
    //add back the animation of the slider
    slider.style.transition = 'all 0.5s';
  })

}, false);

window.addEventListener("resize",debounce(setCarouselScroll));