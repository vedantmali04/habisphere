// Input Tags
let fullNameInput = document.getElementById("signup_fullname");
let usernameInput = document.getElementById("signup_username");
let emailInput = document.getElementById("signup_email");
let createPasswordInput = document.getElementById("signup_create_password");
let confirmPasswordInput = document.getElementById("signup_confirm_password");

// Buttons
let nextBtn = document.getElementById("signup_next");
let backBtn = document.getElementById("signup_back");
let signupBtn = document.getElementById("signup_signup");

// Steps Screens
let form = document.getElementById("signup_form");
let formStep1 = document.getElementById("form_step_1");
let formStep2 = document.getElementById("form_step_2");

nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validationArray = [];

    setInputValue(fullNameInput, "Vedant Mali");
    setInputValue(usernameInput, "vedantmali05");
    setInputValue(emailInput, "v@g.co");

    validationArray.push(validateInput(fullNameInput, "Must be first, middle (optional) and last name."));
    validationArray.push(validateInput(usernameInput, "Choose a valid username"));
    validationArray.push(validateInput(emailInput, "Enter a valid email address."));

    if (!validationArray.includes(false)) {
        // Change to Step 2 - Password Setup
        form.classList.add("step-2");
    }
});

nextBtn.click();

backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    form.classList.remove("step-2");
});


signupBtn.addEventListener("click", function (e) {
    e.preventDefault();

    removeInputMsg(createPasswordInput);
    removeInputMsg(confirmPasswordInput);

    if (!validateInput(createPasswordInput, "Please choose a strong password.")) return;

    if (confirmPasswordInput.value != createPasswordInput.value) {
        setInputMsg(confirmPasswordInput, "Password doesn't match.");
        return;
    }
});