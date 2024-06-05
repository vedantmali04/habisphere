"use strict"

import {
    STORAGE_KEY,
    UI_CLASSES,
    UI_SIZE,
    UI_STATUS_FEEDBACK
} from "./components/data.js";
import { saveToStorage, getFromStorage, generateUniqueID } from "./components/utils.js";
import { getCurrentFileName, getParentElement } from "./components/utils.js";

let CURRENT_USER = getFromStorage(STORAGE_KEY.current_user)[0];
const CURRENT_FILE_NAME = getCurrentFileName();

/* ///////////////
    COMPONENTS HTML CODE
/////////////// */

let COMP_NAV_DRAWER = ``;

if (CURRENT_USER) {

    COMP_NAV_DRAWER = `
    <!-- NAVIGATION DRAWER STARTS -->
    <nav class="nav-drawer">
    
    <!-- LOGO and Close Button -->
    <header class="nav-header">
    <button class="icon nav-close-btn"><i class="bi bi-arrow-bar-left"></i></button>
    </header>
    <div class="divider"></div>
    
    <section class="menu-holder">
    
    
    <!-- User Avatar, Name, Email and Settings link -->
    <menu id="menu_user_info">
    <a class="menu-item ${CURRENT_FILE_NAME == "settings.html" ? "active" : ""}" href="./settings.html">
    <picture class="avatar avatar-column"></picture>
    <span class="info-column">
    <span class="name">${CURRENT_USER.full_name}</span>
    <span class="email fs-300">${CURRENT_USER.email}</span>
    </span>
    <button class="icon settings-btn"><i class="bi bi-gear"></i></button>
    </a>
    </menu>
    
    <!-- Pages Menu -->
    <menu id="menu_pages">
                <a class="menu-item ${CURRENT_FILE_NAME == "index.html" ? "active" : ""}" href="./index.html">
                <span class="icon"><i class="bi bi-grid-1x2"></i></span>
                <span class="icon filled"><i class="bi bi-grid-1x2-fill"></i></span> Habits
                </a>
                <a class="menu-item ${CURRENT_FILE_NAME == "to-do.html" ? "active" : ""}" href="#">
                <span class="icon"><i class="bi bi-check-square"></i></span>
                <span class="icon filled"><i class="bi bi-check-square-fill"></i></span> To-do
                </a>
                <a class="menu-item ${CURRENT_FILE_NAME == "notebook.html" ? "active" : ""}" href="#">
                <span class="icon"><i class="bi bi-sticky"></i></span>
                <span class="icon filled"><i class="bi bi-sticky-fill"></i></span> Notebook
                </a>
                <a class="menu-item ${CURRENT_FILE_NAME == "statistics.html" ? "active" : ""}" href="#">
                <span class="icon"><i class="bi bi-bar-chart-line"></i></span>
                <span class="icon filled"><i class="bi bi-bar-chart-line-fill"></i></span> Statistics
                </a>
                <a class="menu-item ${CURRENT_FILE_NAME == "journal.html" ? "active" : ""}" href="#">
                <span class="icon"><i class="bi bi-journal-bookmark"></i></span>
                <span class="icon filled"><i class="bi bi-journal-bookmark-fill"></i></span> Journal
                </a>
                <a class="menu-item ${CURRENT_FILE_NAME == "challeges.html" ? "active" : ""}" href="#">
                <span class="icon"><i class="bi bi-flag"></i></span>
                <span class="icon filled"><i class="bi bi-flag-fill"></i></span> Challenges
                </a>
                </menu>
                
                
                </section>
                
                <div class="divider"></div>
                
                <menu class="nav-footer">
                <p class="fs-300">© Vedant Mali</p>
                <p class="fs-200">
                <a href="#">About</a>
                <a href="https://github.com/vedantmali05/">GitHub</a>
                <a href="#">Terms</a>
                <a href="#">Policy</a>
                </p>
                </menu>
                <div class="divider"></div>
                <button class="menu-item logout-btn text" name="logout-btn"> <i class="bi bi-door-open"></i> Logout</button>
                
                </nav>
                <!-- NAVIGATION DRAWER ENDS -->
                `;
}

document.addEventListener("DOMContentLoaded", function () {

    /* ///////////////
        NAVIGATION DRAWER
    /////////////// */


    let navDrawerHolder = this.querySelector(".nav-drawer-holder");
    if (navDrawerHolder) {
        navDrawerHolder.innerHTML = COMP_NAV_DRAWER;

        // OPEN NAV button
        let navOpenBtn = this.createElement("button");
        navOpenBtn.classList.add("icon", "nav-open-btn");
        navOpenBtn.innerHTML = `<i class="bi bi-list"></i>`;
        navDrawerHolder.parentNode.prepend(navOpenBtn);

        navOpenBtn = this.querySelector(".nav-open-btn");
        navOpenBtn.addEventListener("click", function () {
            navDrawerHolder.classList.add("visible");
        })


        // CLOSE NAV when clicked on SCRIM
        // navDrawerHolder.classList.add("visible")
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
        SNACKBAR
    /////////////// */

    let snackbarSec = this.createElement("section");
    snackbarSec.classList.add("snackbar-sec");
    this.body.prepend(snackbarSec);


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
        POPULATE AVATAR
    /////////////// */

    let pictureAvatarArray = this.querySelectorAll(".avatar");

    pictureAvatarArray.forEach(elem => {
        let img = this.createElement("img");
        img.src = `./assets/avatars/${CURRENT_USER.avatar}`;
        img.alt = CURRENT_USER.full_name.split(" ")[0];
        elem.appendChild(img);
    })


    /* ///////////////
    POPULATE INPUT CLASSES and HANDLE UI EFFECTS
    /////////////// */

    // FILLABLE INPUTS (all inputs except Radios and Checkboxes)
    let inputArray = this.querySelectorAll("input:not([type=radio]):not([type=checkbox]), .text-input");

    inputArray.forEach(input => {
        input.classList.add("text-input");
        input.classList.toggle("filled", input.value);

        input.addEventListener("blur", function () {
            input.classList.toggle("filled", input.value)
        });

        input.addEventListener("change", function () {
            input.classList.toggle("filled", input.value)
        });

        input.addEventListener("input", function () {
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
        LOGOUT BUTTON
    /////////////// */

    let logoutBtnArray = this.querySelectorAll(".logout-btn")
    logoutBtnArray.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            saveToStorage(STORAGE_KEY.current_user, []);

            window.location.href = "./login.html";
        })
    })

});