"use strict"

import {
    STORAGE_KEY,
    STATUS_UI_FEEDBACK,
    UI_CLASSES,
    UI_SIZE
} from "./components/data.js";
import { saveToStorage, getFromStorage, generateUniqueID } from "./components/utils.js";
import { getCurrentFileName, getParentElement } from "./components/utils.js";
import { User } from "./components/utils.js";
import { setInputMsg, removeInputMsg, validateInput, validateToggleInputs, setInputValue } from "./components/utils.js";
import { compNavDrawer } from "./components/components.js";

const CURRENT_USER = getFromStorage(STORAGE_KEY.current_user)[0];

document.addEventListener("DOMContentLoaded", function () {

    /* ///////////////
        POPULATE LOGO
    /////////////// */
    let pictureLogoArray = this.querySelectorAll(".logo");

    pictureLogoArray.forEach(logo => {
        let img = this.createElement("img");
        img.src = "./assets/logo/logo.svg";
        switch (logo.getAttribute("data-size")) {
            case UI_SIZE.xs:
                img.style.width = "3.2rem";
                break;
            case UI_SIZE.s:
                img.style.width = "4.8rem";
                break;
            default: case UI_SIZE.m:
                img.style.width = "6.4rem";
                break;
            case UI_SIZE.l:
                img.style.width = "8rem";

                break;
            case UI_SIZE.xl:
                img.style.width = "9.6rem";

                break;
        }
        if (logo.getAttribute("data-name") == "true") {
            let logoName = this.createElement("p");
            logoName.innerHTML = `Habisphere`;
            logo.appendChild(logoName)
        }
        logo.appendChild(img);
    });


    /* ///////////////
    POPULATE INPUT CLASSES and HANDLE UI EFFECTS
    /////////////// */

    // FILLABLE INPUTS (all inputs except Radios and Checkboxes)
    let inputArray = this.querySelectorAll("input:not([type=radio]):not([type=checkbox])");

    inputArray.forEach(input => {
        input.classList.add("text-input");
        input.classList.add(input.value ? "filled" : "unfilled");

        input.addEventListener("blur", function () {
            input.classList.toggle("filled", input.value)
        });

        // POPULATE 👁️ Password Visibility Button if current input is Password
        if (input.type == "password") {
            let passwordVisibilityBtn = this.createElement("button");
            passwordVisibilityBtn.type = "button";
            passwordVisibilityBtn.classList.add("password-visibility-btn", "trail", "icon");
            passwordVisibilityBtn.innerHTML = `<i class="bi bi-eye"></i><i class="bi bi-eye-slash"></i>`;

            // Get Parent Element of current Password Input and  append Eye button in it.
            getParentElement(input, UI_CLASSES.fieldset).append(passwordVisibilityBtn);

            // Password Visibility Event
            passwordVisibilityBtn.addEventListener("click", function (e) {
                e.preventDefault();
                input.type = input.type == "password" ? "text" : "password";
                passwordVisibilityBtn.classList.toggle("visible", input.type != "password");
            })
        }
    })

    // TOGGLE INPUTS like Radio and Checkbox
    let inputToggleArray = this.querySelectorAll("input[type=radio], input[type=checkbox]");
    inputToggleArray.forEach(input => {
        input.classList.add("toggle-input");
    });

    /* ///////////////
        NAVIGATION DRAWER
    /////////////// */


    let navDrawerHolder = this.querySelector(".nav-drawer-holder");
    if (navDrawerHolder) {
        navDrawerHolder.innerHTML = compNavDrawer(CURRENT_USER);

        // OPEN NAV button
        let navOpenBtn = this.createElement("button");
        navOpenBtn.classList.add("icon", "nav-open-btn");
        navOpenBtn.innerHTML = `<i class="bi bi-list"></i>`;
        navDrawerHolder.parentNode.append(navOpenBtn);

        navOpenBtn = this.querySelector(".nav-open-btn");
        navOpenBtn.addEventListener("click", function () {
            navDrawerHolder.classList.add("visible");
        })

        // <button class="icon nav-close-btn"><i class="bi bi-arrow-left"></i></button>

        // CLOSE NAV when clicked on SCRIM
        navDrawerHolder.classList.add("visible")
        navDrawerHolder.addEventListener("click", function (event) {
            if (!event.target.closest(".nav-drawer")) {
                navDrawerHolder.classList.remove("visible");
            }
        })

        // CLOSE NAV when clicked on NAV-CLOSE-BTN
        let navCloseBtn = this.querySelector(".nav-close-btn");
        navCloseBtn.addEventListener("click", function () {
            navDrawerHolder.classList.remove("visible");
        })
    }




    /* ///////////////
        LOGOUT BUTTON
    /////////////// */

    let logoutBtnArr = this.querySelectorAll(".logout-btn")
    logoutBtnArr.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            saveToStorage(STORAGE_KEY.current_user, []);

            window.location.href = "./login.html";
        })
    })

});