const slideNav = document.querySelector('.slide-nav');
const slider = document.querySelector('.slider');
const carousel = document.querySelector('.carousel');
const carouselWidth = carousel.offsetWidth;
const numSlides = slider.childElementCount;
const container = document.querySelector('.container-outer');

let touchstartX = 0;
let touchendX = 0;
let translateAmount = `${100/numSlides}%`; //how far to move the slides
let direction = 'left'; //set initial direction

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
                      width: ${numSlides * carouselWidth}px;
                      display: grid;
                      grid-template-columns: repeat(${numSlides}, ${1/numSlides}fr);
                      transition: all 0.5s;
                      `;

function removeCurrentClass() {
  document.querySelector('.btn--number--current').classList.remove('btn--number--current');
}

function addCurrentClass(element) {
  element.classList.add('btn--number--current');
}

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
    let slideId = slideInViewport().id;
    // let button = document.querySelector(`a[href*="${slideId}"]`);
    // removeCurrentClass();
    // addCurrentClass(button);
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

function slideInViewport() {
  let i = 0;
  let slide = null;
  for (i = 0; i < numSlides; i++) {
    if (isInViewport(slider.children[i])) {
      slide = slider.children[i];
    }
  }
   return slide;
}

function isInViewport(element) {
  console.log(element)
    const rect = element.getBoundingClientRect();
    console.log(rect.left);
    console.log(rect.right)
    console.log(carousel.offsetWidth);
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (carousel.innerHeight) &&
        rect.right <= (carousel.innerWidth )
    );
}

slideNav.addEventListener('click', (event) => {
  removeCurrentClass();
  addCurrentClass(event.target);
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

  //delay the setting of the transition
  setTimeout(function() {
    //add back the animation of the slider
    slider.style.transition = 'all 0.5s';
  })

}, false);

window.addEventListener("resize",debounce(setCarouselScroll));