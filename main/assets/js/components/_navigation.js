const navbar = document.querySelector('.nav-bar');
const navIcon = document.querySelector('.nav-icon');
const nav = document.querySelector('.nav');

navIcon.addEventListener('click', () => toggleNavbar())

// listen for key events
window.addEventListener('keyup', function(event){
  // listen for esc key
  if( keyPressed(event, 27, 'escape') && navbarOpen()) {
    toggleNavbar();
  } else if (keyPressed(event, 36, 'enter') && !navbarOpen()) {
    toggleNavbar();
  }
});

//close or open the navbar and change aria-expanded state
const toggleNavbar = () => {
  navbar.classList.toggle('open');
  navIcon.setAttribute('aria-expanded', navbarOpen());
  nav.hidden = !nav.hidden;
};

//check if navbar is open
const navbarOpen = () => navbar.classList.contains('open') ? true : false;

//check if key has been pressed
const keyPressed = (event, key, label) => (event.key && event.key == key) || (event.key && event.key.toLowerCase() == label)
