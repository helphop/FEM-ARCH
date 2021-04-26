const navigation = document.querySelector('.navigation');
const navIcon = document.querySelector('.nav-icon');
const nav = document.querySelector('.nav');

navIcon.addEventListener('click', () => toggleNavigation())

// listen for key events
window.addEventListener('keyup', function(event){
  // listen for esc key
  if( keyPressed(event, 27, 'escape') && navbarOpen()) {
    toggleNavigation();
  } else if (keyPressed(event, 36, 'enter') && !navbarOpen()) {
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
