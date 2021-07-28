
//add event listeners

const connectForm = document.querySelector('.connect__form');

if(elementExists(connectForm)) {
  const submitButton = document.querySelector('button[type="submit"]');
  const errorElement = `<p class='error-message'>Can't be empty</p>`;
  const formInputs = [...connectForm.elements];
  //remove the last element which is the button
  formInputs.pop()

  formInputs.forEach(formInput => formInput.addEventListener('input', (e) => validateInput(formInput)));
  formInputs.forEach(formInput => formInput.addEventListener('focusout', (e) => validateInput(formInput)));

  submitButton.addEventListener('click', (e)=> {
    e.preventDefault();
    formInputs.forEach(formInput => validateInput(formInput))
  })

  function validateInput(formInput) {
      const errorMessage = formInput.parentNode.querySelector('.error-message');
      if (formInput.value.trim() === "" && !errorMessage) {
       formInput.insertAdjacentHTML('afterend', errorElement);
       formInput.parentNode.classList.add('error');
      } else if (formInput.value.trim() !== "" && errorMessage) {
        formInput.parentNode.classList.remove('error');
        errorMessage.remove();
      }
  }
}
const map = document.getElementById('mapContainer')

if (elementExists(map)) {
  //Toronto Map
	const coordinatesTen = [36.17006, -86.78382];
  const coordinatesTex = [32.51935, -94.474008];
  const coordinatesUSA = [34.91735, -90.92906];
  const details = document.querySelector('.details');

	const mapUSA = L.map('mapContainer').setView(coordinatesUSA, 5.5);
	createMapTile(mapUSA);
	const markerTen = L.marker(coordinatesTen).addTo(mapUSA);
  const markerTex = L.marker(coordinatesTex).addTo(mapUSA);

  //Setup how the user interacts with the map
	setMapControl(mapUSA);

  details.addEventListener('click', (e) => {
    e.preventDefault()
    link = e.target;
    addressId = link.dataset.addressId;
    address = document.getElementById(addressId).textContent;
    title = document.getElementById(link.dataset.titleId).textContent;
    marker = addressId === "mainOffice" ? markerTen : markerTex;
    openMarkerPopup(marker, address, title);
  })

  function openMarkerPopup(marker, address, title) {
    marker.bindPopup(`<span class='font-bold'>${title}</span><br>${address}.`).openPopup();
  }

  function createMapTile(mapName) {
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 10,
			tileSize: 512,
			zoomOffset: -1,
		}).addTo(mapName);
	}

  //disable scroll zoom until user clicks on map
	function setMapControl(mapName){
			mapName.scrollWheelZoom.disable();
			mapName.on('focus', () => { mapName.scrollWheelZoom.enable(); });
			mapName.on('blur', () => { mapName.scrollWheelZoom.disable(); });
	}

}
const navigation = document.querySelector('.navigation');
const navIcon = document.querySelector('.nav-icon');
const nav = document.querySelector('.nav');

navIcon.addEventListener('click', () => toggleNavigation())

// listen for key events
window.addEventListener('keyup', function(event){
  // listen for esc key
  if( keyPressed(event, 27, 'escape') && navigationOpen()) {
    toggleNavigation();
  } else if (keyPressed(event, 36, 'enter') && !navigationOpen()) {
    toggleNavigation();
  }
});

//close or open the navigation and change aria-expanded state
const toggleNavigation = () => {
  navigation.classList.toggle('open');
  navIcon.setAttribute('aria-expanded', navigationOpen());
  nav.hidden = !nav.hidden;
};

//check if navigation is open
const navigationOpen = () => navigation.classList.contains('open') ? true : false;

//check if key has been pressed
const keyPressed = (event, key, label) => (event.key && event.key == key) || (event.key && event.key.toLowerCase() == label)

const carousel = document.querySelector('.carousel');

if (elementExists(carousel)) {
  const slideNav = document.querySelector('.slide-nav');
  const slider = document.querySelector('.slider');
  const carouselWidth = carousel.offsetWidth;
  const numSlides = slider.childElementCount;
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
    if (slider.offsetWidth > 3158) setCurrentButton(getButtonForSlide(currentSlide.id));
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
    else if (touchendX > touchstartX) {
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
    console.log('touched')
    touchstartX = e.changedTouches[0].screenX;
  });

  //listen for finger gesture end
  slider.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
  });

  //listen for when the slide has finished moving
  slider.addEventListener('transitionend', function(e) {
    //check that it is the transform that has been fired not the button background color or other property
    if (e.propertyName === "transform") {
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
    }
  }, false);

  window.addEventListener("resize",debounce(resetCarousel));

}

//Capitalizes the first letter of a string
const capitalizeFirstLetter = (string) =>  string.charAt(0).toUpperCase() + string.slice(1);


//slow down the execution of some function
function debounce(func, delay=200){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,delay,event);
  };
}

//returns true if the slides left side location matches the carousel's left side location
const isInViewport = (element1, element2) => (element1.getBoundingClientRect().left === element2.getBoundingClientRect().left);

//returns the last character in a given string
const lastChar = (str) => str.charAt(str.length - 1);

//used to detect if element is present on page
function elementExists(elem) {
  return (typeof(elem) != 'undefined' && elem != null)
}