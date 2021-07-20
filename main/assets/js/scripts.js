// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.getAttribute('class').match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.setAttribute('class', el.getAttribute('class') +  " " + classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
    el.setAttribute('class', el.getAttribute('class').replace(reg, ' '));
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
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
    marker = addressId === "mainOffice" ? "markerTen" : "markerTex";
    openMarkerPopup(marker, address, title);
  })

  function openMarkerPopup(marker, address, title) {
    eval(marker).bindPopup(`<span class='font-bold'>${title}</span><br>${address}.`).openPopup();
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