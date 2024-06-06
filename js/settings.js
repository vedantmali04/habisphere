
/* ///////////////
    IMPORTS
/////////////// */

import {
    STORAGE_KEY,
    UI_CLASSES,
    UI_SIZE,
    UI_STATUS_FEEDBACK
} from "./components/data.js";
import { User, refreshInputs, removeInputMsg, setInputMsg, setInputValue, validateInput } from "./components/utils.js";
import { createSnackbar, createDialog } from "./components/utils.js";
import { saveToStorage, getFromStorage, generateUniqueID } from "./components/utils.js";
import { getCurrentFileName, getParentElement } from "./components/utils.js";

// INITIALIZATION -  CURRENT USER
let CURRENT_USER = getFromStorage(STORAGE_KEY.current_user)[0];


/* ///////////////
    ON DOCUMENT CONTENT LOADED
/////////////// */

document.addEventListener("DOMContentLoaded", function () {

    /* ///////////////
        SET NEW AVATAR
    /////////////// */


    // POPULATE AVATARS INPUTS
    let avatarRadiosBox = this.querySelector(".avatar-radios-box .check-radio-box");

    for (let i = 1; i <= 12; i++) {
        let avatarSrc = `avatar-${i}.svg`;
        let isChecked = CURRENT_USER.avatar === avatarSrc;
        let avatarId = `avatar_${i}`
        let avatarLabel = document.createElement("label");
        avatarLabel.setAttribute("for", `avatar_${i}`);

        avatarLabel.innerHTML = `
          <input type="radio" name="choose-avatar" value="${avatarSrc}" id="${avatarId}" ${isChecked ? 'checked' : ''}>
          <picture><img src="./assets/avatars/${avatarSrc}"></picture>
        `;

        avatarRadiosBox.append(avatarLabel);
    }

    // Show Choose Avatar Section to visible
    let avatarChooseSec = this.querySelector(".choose-avatar-sec");

    let avatarEditBtn = this.querySelector(".edit-avatar-btn");
    avatarEditBtn.addEventListener("click", function () {
        avatarChooseSec.classList.add("visible");
    })

    // Hide Choose Avatar Section
    let avatarChoiceCloseBtn = this.querySelector(".close-avatar-choice-btn");
    avatarChoiceCloseBtn.addEventListener("click", function () {
        avatarChooseSec.classList.remove("visible");
    })

    // CHOOSING THE POPULATED INPUTS AND UPDATING IN DATABASE
    let avatarRadiosArr = this.querySelectorAll("[name='choose-avatar']");

    avatarRadiosArr.forEach(radio => {
        // On Radio Button Selected
        radio.addEventListener("change", function () {

            // Update avatar value (both frontend and backend)
            CURRENT_USER.avatar = radio.value;
            CURRENT_USER = new User().updateUser(CURRENT_USER);

            // Update all avatars IMG elements
            let avatarImgsArr = document.querySelectorAll(".avatar img");

            avatarImgsArr.forEach(img => {

                img.style.opacity = ".1";
                img.style.filter = "grayscale(1)";

                setTimeout(() => {
                    img.src = `./assets/avatars/${CURRENT_USER.avatar}`;
                    img.style.opacity = "1";
                    img.style.filter = "grayscale(0)";
                }, 400)
            })
        })
    })

    /* ///////////////
    UPDATE ACCOUNT INFORMATION - EDIT INFO SEC
    /////////////// */

    let fullnameInput = this.querySelector("#settings_fullname");
    let usernameInput = this.querySelector("#settings_username");
    let bioInput = this.querySelector("#settings_bio");
    let emailInput = this.querySelector("#settings_email");
    let saveChangesBtn = this.querySelector("#settings_save_changes");


    // Change LABEL class to filled, if the value exists
    fullnameInput.classList.toggle("filled", CURRENT_USER.full_name);
    usernameInput.classList.toggle("filled", CURRENT_USER.username);
    bioInput.classList.toggle("filled", CURRENT_USER.bio);
    emailInput.classList.toggle("filled", CURRENT_USER.email);

    // STORING VALUES TEMPORARILY
    let fullname = CURRENT_USER.full_name;
    let username = CURRENT_USER.username;
    let bio = CURRENT_USER.bio;
    let email = CURRENT_USER.email;

    // Fill value from DATABASE to INPUTs
    fullnameInput.value = fullname;
    usernameInput.value = username;
    bioInput.value = bio;
    emailInput.value = email;

    saveChangesBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove previous messages, if any
        removeInputMsg(this, UI_STATUS_FEEDBACK.tip)

        // Initialize with input values
        let inputFullname = fullnameInput.value;
        let inputUsername = usernameInput.value;
        let inputBio = bioInput.value;
        let inputEmail = emailInput.value;

        // If details aren't updated, give feedback and return
        if (
            inputFullname == fullname &&
            inputUsername == username &&
            inputBio == bio &&
            inputEmail == email
        ) {
            setInputMsg(this, "You haven't made any changes.", UI_STATUS_FEEDBACK.tip);
            setTimeout(() => {
                removeInputMsg(this, UI_STATUS_FEEDBACK.tip);
            }, 7000);
            return;
        }

        // Validate all inputs
        let validationArray = [];

        validationArray.push(validateInput(fullnameInput, "Must be first, middle (optional) and last name."));
        validationArray.push(validateInput(usernameInput, "Must be at least 6 characters and must contain a number"));
        validationArray.push(validateInput(emailInput, "Enter a valid email address."));


        if (!validationArray.includes(false)) {
            validationArray = [];

            // If new username is already taken
            if (new User().getUserBasedOnKey("username", inputUsername) && inputUsername != username) {
                setInputMsg(usernameInput, "This username is already taken");
                validationArray.push(false);
            }

            // If new email is already taken
            if (new User().getUserBasedOnKey("email", inputEmail) && inputEmail != email) {
                setInputMsg(emailInput, `This  email is already taken`);
                validationArray.push(false);
            }

            if (!validationArray.includes(false)) {

                saveChangesBtn.disabled = true;
                // Give user feedback about the update, and provide UNDO option
                createSnackbar({
                    msg: "Account details updated", status: UI_STATUS_FEEDBACK.success, undo: function () {
                        // Resetting updates on UNDO button clicked
                        fullnameInput.value = fullname;
                        usernameInput.value = username;
                        bioInput.value = bio;
                        emailInput.value = email;
                        CURRENT_USER.full_name = fullnameInput.value;
                        CURRENT_USER.username = usernameInput.value;
                        CURRENT_USER.bio = bioInput.value;
                        CURRENT_USER.email = emailInput.value;
                        CURRENT_USER = new User().updateUser(CURRENT_USER);
                        saveChangesBtn.disabled = false;
                        window.location.reload();
                        return;
                    }
                });
                CURRENT_USER.full_name = fullnameInput.value;
                CURRENT_USER.username = usernameInput.value;
                CURRENT_USER.bio = bioInput.value;
                CURRENT_USER.email = emailInput.value;
                CURRENT_USER = new User().updateUser(CURRENT_USER);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }

        }
    })

    let resetPasswordBtn = this.querySelector("#reset_password_btn");

    resetPasswordBtn.addEventListener("click", function (e) {
        e.preventDefault();


        let isPasswordUpdated = createDialog({
            headline: "Reset Password",
            description: `Updating your account password regularly keeps your account safe from constant access and account breaches. Set a strong yet easy to remember password for you!`,
            componentID: "reset_password",
            primaryBtnLabel: `Reset`,
            fullscreen: false,
            secondaryAction: function () {
                createSnackbar({ msg: "Password reset cancelled." })
            },
            primaryAction: function () {

                refreshInputs();

                // GET ALL PASSWORD INPUT TAGS
                let currentPasswordInput = document.getElementById("settings_current_password");
                let newPasswordInput = document.getElementById("settings_new_password");
                let confirmPasswordInput = document.getElementById("settings_confirm_password");

                // REMOVE PRESET MESSAGES IF ANY
                removeInputMsg(currentPasswordInput);
                removeInputMsg(newPasswordInput);
                removeInputMsg(confirmPasswordInput);

                // FLAG ARRAY - Must contain all True values to proceed
                let validationArray = [];

                // VALIDATE CURRENT PASSWORD - IF EMPTY and MATCHES WITH CURRENT PASSWORD
                validationArray.push(validateInput(currentPasswordInput))
                if (validationArray[0]) {
                    if (CURRENT_USER.password !== currentPasswordInput.value) {
                        setInputMsg(currentPasswordInput, "Current Password didn't match");
                        validationArray.push(false);
                    }
                }

                validationArray.push(validateInput(newPasswordInput, "Please choose a strong password"));
                validationArray.push(validateInput(confirmPasswordInput));

                if (confirmPasswordInput.value && confirmPasswordInput.value != newPasswordInput.value) {
                    setInputMsg(confirmPasswordInput, "Passwords doesn't match")
                    validationArray.push(false);
                }

                if (CURRENT_USER.password == newPasswordInput.value) {
                    setInputMsg(newPasswordInput, "Old password and New Password cannot be same");
                }

                if (!validationArray.includes(false)) {
                    CURRENT_USER.password = newPasswordInput.value;
                    CURRENT_USER = new User().updateUser(CURRENT_USER);
                    createSnackbar({
                        msg: "Password updated",
                        status: UI_STATUS_FEEDBACK.success,
                    })
                    return true;
                } else {
                    return false;
                }

            }
        });

    })
})