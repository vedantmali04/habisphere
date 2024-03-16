// Input Tags
let fullNameInput = document.getElementById("signup_fullname");
let usernameInput = document.getElementById("signup_username");
let emailInput = document.getElementById("signup_email");

// Buttons
let nextBtn = document.getElementById("signup_next");

nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    validateInput(fullNameInput);
})


nextBtn.click();