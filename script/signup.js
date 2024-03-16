// Input Tags
let fullNameInput = document.getElementById("signup_fullname");
let usernameInput = document.getElementById("signup_username");
let emailInput = document.getElementById("signup_email");

// Buttons
let nextBtn = document.getElementById("signup_next");

nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validationArray = [];

    validationArray.push(validateInput(fullNameInput, "Must be first, middle (optional) and last name."));
    validationArray.push(validateInput(usernameInput, "Choose a valid username"));
    validationArray.push(validateInput(emailInput, "Enter a valid email address."));
});