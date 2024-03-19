// Input Tags
let fullNameInput = document.getElementById("signup_fullname");
let usernameInput = document.getElementById("signup_username");
let emailInput = document.getElementById("signup_email");
let termsAndPolicyCheckboxes = document.getElementsByName("signup_t_and_p");

// Buttons
let nextBtn = document.getElementById("signup_next");
let backBtn = document.getElementById("signup_back");

// Steps Screens
let form = document.getElementById("signup_form");
let formStep1 = document.getElementById("form_step_1");
let formStep2 = document.getElementById("form_step_2");

nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validationArray = [];

    validationArray.push(validateInput(fullNameInput, "Must be first, middle (optional) and last name."));
    validationArray.push(validateInput(usernameInput, "Choose a valid username"));
    validationArray.push(validateInput(emailInput, "Enter a valid email address."));
    validationArray.push(validateToggleInputs(termsAndPolicyCheckboxes));

    if (!validationArray.includes(false)) {
        // Change to Step 2 - Password Setup
        form.classList.add("step-2");
    }
});

backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    form.classList.remove("step-2");
});