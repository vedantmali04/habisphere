
/* ///////////////
    IMPORTS
/////////////// */

import {
    STORAGE_KEY,
    UI_CLASSES,
    UI_SIZE
} from "./components/data.js";
import { User } from "./components/utils.js";
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

    let updateInfoFullNameInput = this.querySelector("#settings_fullname");
    let updateInfoUsernameInput = this.querySelector("#settings_username");
    let updateInfoBioInput = this.querySelector("#settings_bio");
    let updateInfoEmailInput = this.querySelector("#settings_email");
    let updateInfoSaveChangesBtn = this.querySelector("#settings_save_changes");
    
    // Change LABEL class to filled, if the value exists
    updateInfoFullNameInput.classList.toggle("filled", CURRENT_USER.full_name);
    updateInfoUsernameInput.classList.toggle("filled", CURRENT_USER.username);
    updateInfoBioInput.classList.toggle("filled", CURRENT_USER.bio);
    updateInfoEmailInput.classList.toggle("filled", CURRENT_USER.email);

    // Fill value from DATABASE to INPUTs
    updateInfoFullNameInput.value = CURRENT_USER.full_name;
    updateInfoUsernameInput.value = CURRENT_USER.username;
    updateInfoBioInput.value = CURRENT_USER.bio;
    updateInfoEmailInput.value = CURRENT_USER.email;
    
})