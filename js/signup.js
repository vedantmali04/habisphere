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

// From Password Step to Details Step
backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    form.classList.remove("step-2");
});

// Signup Button Press
signupBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove older error messages
    removeInputMsg(createPasswordInput);
    removeInputMsg(confirmPasswordInput);

    // If password and email is the same
    if (createPasswordInput.value == emailInput.value) {
        setInputMsg(createPasswordInput, "Email and Password must not be same.")
    }

    // If password doesn't satisfy the conditions
    if (!validateInput(createPasswordInput, "Please choose a strong password.")) return;

    // If Created password and Confirmed password aren't same
    if (confirmPasswordInput.value != createPasswordInput.value) {
        setInputMsg(confirmPasswordInput, "Password doesn't match.");
        return;
    }

    // If name, username, email is changed after nextBtn is pressed from the Inspect
    if (fullNameInput.value != newUser.full_name
        || usernameInput.value != newUser.username
        || emailInput.value != newUser.email) {
        alert("Something went wrong.");
        window.location.reload();
    }


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

});