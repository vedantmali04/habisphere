import {
    STORAGE_KEY,
} from "./components/data.js";
import { saveToStorage, getFromStorage } from "./components/utils.js";
import { User } from "./components/utils.js";
import { setInputMsg, removeInputMsg, validateInput, validateToggleInputs, setInputValue } from "./components/utils.js";

// Input Tags
let idInput = document.getElementById("login_id");
let passwordInput = document.getElementById("login_password");

// Buttons
let loginBtn = document.getElementById("login_login");

// Login Button Press
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove older error messages
    removeInputMsg(idInput);
    removeInputMsg(passwordInput);

    // If username or email is not entered, inform the user
    if (!idInput.value) {
        setInputMsg(idInput, "Please enter your username or email");
        return;
    }

    // If password is not entered, inform the user
    if (!passwordInput.value) {
        setInputMsg(passwordInput, "Please enter a password.");
        return;
    }

    // Search a user by Email or Username
    let userByEmail = new User().getUserBasedOnKey("email", idInput.value);
    let userByUsername = new User().getUserBasedOnKey("username", idInput.value);

    // Set a default currentUser
    let currentUser = null;

    // If user found by Email, and the password matched
    if (userByEmail && userByEmail.password == passwordInput.value) {
        currentUser = userByEmail;

        // If user found by Username, and the password matched
    } else if (userByUsername && userByUsername.password == passwordInput.value) {
        currentUser = userByUsername;
    } else {

        // If user not found, if user found but password is incorrect and if both credentials are invalid, inform the user
        setInputMsg(idInput, "User, Email or Password did not match. Try with correct login credentials.");
        return;
    }

    // Disable the login button and navigate to the dashboard, if current user exist
    if (currentUser != null) {
        loginBtn.disabled = true;
        saveToStorage(STORAGE_KEY.current_user, [currentUser]);
        window.location.href = "./index.html";
    }

});