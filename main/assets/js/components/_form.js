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