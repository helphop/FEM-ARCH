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