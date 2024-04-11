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

// New User
let newUser;

nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validationArray = [];
    // If inputs are invalid
    validationArray.push(validateInput(fullNameInput, "Must be first, middle (optional) and last name."));
    validationArray.push(validateInput(usernameInput, "Must be at least 6 characters and must contain a number"));
    validationArray.push(validateInput(emailInput, "Enter a valid email address."));

    if (!validationArray.includes(false)) {
        newUser = new User(fullNameInput.value, usernameInput.value, emailInput.value);

        validationArray = [];

        // If username is already taken
        if (newUser.getUserBasedOnKey("username", usernameInput.value)) {
            setInputMsg(usernameInput, "This username is already taken");
            validationArray.push(false);
        }

        // If email is already exists
        if (newUser.getUserBasedOnKey("email", emailInput.value)) {
            setInputMsg(emailInput, `Account with this email already exists. Use a different email or <a href=\"./login.html\">login instead</a>`);
            validationArray.push(false);
        }

        if (!validationArray.includes(false)) {
            // Change to Step 2 - Password Setup
            form.classList.add("step-2");
        }

    }
});

backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    form.classList.remove("step-2");
});


signupBtn.addEventListener("click", function (e) {
    e.preventDefault();

    removeInputMsg(createPasswordInput);
    removeInputMsg(confirmPasswordInput);

    if (createPasswordInput.value == emailInput.value) {
        setInputMsg(createPasswordInput, "Email and Password must not be same.")
    }

    if (!validateInput(createPasswordInput, "Please choose a strong password.")) return;

    if (confirmPasswordInput.value != createPasswordInput.value) {
        setInputMsg(confirmPasswordInput, "Password doesn't match.");
        return;
    }

    validationArray = [];

    if (newUser.getUserBasedOnKey("username", usernameInput.value)) {
        setInputMsg(usernameInput, "This username is already taken");
        validationArray.push(false);
        backBtn.click();
    }
    if (newUser.getUserBasedOnKey("email", emailInput.value)) {
        setInputMsg(emailInput, `Account with this email already exists. Use a different email or <a href=\"./login.html\">login instead</a>`);
        validationArray.push(false);
        backBtn.click();
    }

    if (!validationArray.includes(false)) {
        // Set the created password
        newUser.setPassword(createPasswordInput.value);

        // Save created user to the storage
        newUser.saveNewUser();

        // Add the unique user ID of the new user to the taken_UIDs
        let userIDs = getFromStorage(KEY_TAKEN_UIDS);
        userIDs.push(newUser.user_id);
        saveToStorage(KEY_TAKEN_UIDS, userIDs);

        // Disable the signup button and navigate to the dashboard
        signupBtn.disabled = true;
        saveToStorage(KEY_CURRENT_USER, [newUser]);
        window.location.href = "./index.html";
    }

});