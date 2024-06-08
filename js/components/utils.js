import {
    STORAGE_KEY,
    UI_STATUS_FEEDBACK,
    UI_CLASSES,
    UI_THEME
} from "./data.js";

/* ///////////////
DATA STORAGE FUNCTIONS
/////////////// */

// FUNCTION to SAVE data to storage throughout the project
export function saveToStorage(key, data) {
    try {
        if (!key || typeof key !== "string") {
            throw new Error("Invalid key: Key must be a non-empty string.");
        }

        data = data.filter(item => item !== null);

        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);

    } catch (error) {
        return null;
    }
}

// FUNCTION to READ data to storage throughout the project
export function getFromStorage(key) {
    try {
        if (!key || typeof key !== "string") {
            throw new Error("Invalid key: Key must be a non-empty string.");
        }

        // Retrieve data
        const storedData = localStorage.getItem(key);
        if (!storedData) {
            throw new Error("Key not found");
        }

        // Parse retrieved data
        const parsedData = JSON.parse(storedData);

        return parsedData;

    } catch (error) {
        return null;
    }
}

// FUNCTION to GENERATE UNIQUE IDs for certain application
export function generateUniqueID(prefix = "") {
    let idArray = getFromStorage(STORAGE_KEY.taken_uids);

    while (true) {
        let uid = prefix + Date.now().toString().slice(-9);
        if (!idArray.includes(uid)) {
            idArray.push(uid);
            return uid;
        }
    }
}

/* ///////////////
FUNCTIONS for INITILIZING certain page info
/////////////// */

// FUNCTION to get html page name
export function getCurrentFileName() {
    // Get the last part
    let fileName = window.location.href
        .split("/")
        .pop()
        .split("?")[0]
        .split("#")[0]
        .replace(/%20|%|\+/g, " ")
        .trim();

    // If no filename give
    if (fileName == "") {
        fileName = "index.html";
    }

    // If no extension is given, assign .html
    if (fileName.split(".").length == 1) {
        fileName += ".html";
    }

    // If the file name is invalid or hidden
    if (!fileName.match(/^[a-zA-Z0-9._ -]+$/)) {
        return null;
    }

    return fileName;
}

/* ///////////////
    FUNCTIONS for DOM TRAVERSAL
/////////////// */

// FUNCTION to TRAVERSE and RETURN the PARENT with given class
export function getParentElement(element, targetParent) {
    let parent = element.parentNode;
    return parent.tagName.toUpperCase() == targetParent.toUpperCase()
        ? parent
        : getParentElement(parent, targetParent);
}



/* ///////////////
CLASSES, OBJECTS, USER, HABITS, etc. CODE
/////////////// */

// Class Settings has user settings
export class Settings {
    theme = UI_THEME.light;
    animations = true;
    dashboard = {
        tasks: true,
        journal: true,
        quote: true
    };
}

// Class User has user data
export class User extends Settings {
    user_id;
    full_name;
    username;
    email;
    password;
    bio;
    avatar;
    created_time;

    constructor(full_name = "", username = "", email = "") {
        super();
        if (![full_name, username, email].includes("")) {
            this.user_id = generateUniqueID("uid");
            this.full_name = full_name;
            this.username = username;
            this.email = email;
            this.password = "";
            this.bio = "";
            this.avatar = "avatar-2.svg";
            this.created_time = Date.now();
        }
    }

    // Update password
    setPassword(password) {
        this.password = password;
    }

    // FUNCTION to save new user to storage
    saveNewUser() {
        let userArray = getFromStorage(STORAGE_KEY.users);
        userArray.push(this);
        saveToStorage(STORAGE_KEY.users, userArray);
    }

    // Check if user already exists
    getUserBasedOnKey(key, value) {
        let userArray = getFromStorage(STORAGE_KEY.users);
        let foundUser = null;
        userArray.forEach(user => {
            if (user[key] == value) foundUser = user;
        })
        return foundUser;
    }

    // Find and update user with current user
    updateUser(updatedCurrentUser) {
        let userArray = getFromStorage(STORAGE_KEY.users);
        userArray.forEach((user, i) => {
            if (user.user_id == updatedCurrentUser.user_id) {
                userArray[i] = updatedCurrentUser;
            }
        })
        saveToStorage(STORAGE_KEY.users, userArray);
        saveToStorage(STORAGE_KEY.current_user, [updatedCurrentUser]);
        return getFromStorage(STORAGE_KEY.current_user)[0];
    }
}

/* ///////////////
    UI COMPONENTS FUNCTIONS
/////////////// */

/* ///////////////
    FUNCTION FOR HANDLING INPUTS
/////////////// */


// FUNCTION to REFRESH INPUT TAG PROPERTIES
export function refreshInputs() {
    // FILLABLE INPUTS (all inputs except Radios and Checkboxes)
    let inputArr = document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), .text-input");

    inputArr.forEach(input => {
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
            let passwordVisibilityBtn = document.createElement("button");
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
    let inputToggleArr = document.querySelectorAll("input[type=radio], input[type=checkbox]");
    inputToggleArr.forEach(input => {
        input.classList.add("toggle-input");
    });
}

// FUNCTION to SET specified INPUT MESSAGE
export function setInputMsg(inputTag, msg, status = UI_STATUS_FEEDBACK.error) {
    removeInputMsg(inputTag, status);

    // Create message div
    const msgDiv = document.createElement("div");
    // Set class, by default, it's "error"
    msgDiv.classList.add("msg", status);
    msgDiv.innerHTML = `<span>${msg}</span>`;

    // Find parent for appending
    const fieldset = getParentElement(inputTag, UI_CLASSES.fieldset);
    fieldset.append(msgDiv);
}

// FUNCTION to REMOVE specified INPUT MESSAGE
export function removeInputMsg(inputTag, status = UI_STATUS_FEEDBACK.error) {
    const fieldset = getParentElement(inputTag, UI_CLASSES.fieldset);
    // Get type of msg to be deleted, by default, "error"
    fieldset.querySelectorAll("." + status).forEach(div => div.remove());
}

// FUNCTION for INPUT VALIDATION
export function validateInput(inputTag, errorMsg) {
    inputTag.value = inputTag.value.trim();
    if (inputTag.required && !inputTag.value) {
        setInputMsg(inputTag, "This field is required");
        return false;
    }

    const pattern = inputTag.pattern?.trim();
    if (!pattern || new RegExp(pattern).test(inputTag.value.trim())) {
        removeInputMsg(inputTag);
        return true
    };

    setInputMsg(inputTag, errorMsg);
    return false;
}

// FUNCTION to validate TOGGLE INPUTS like radio and checkboxes
export function validateToggleInputs(toggleInputs, msg = "This field is required") {
    let validationArray = [];
    toggleInputs.forEach(input => {
        if (input.required && !input.checked) {
            validationArray.push(false);
        }
    })

    if (validationArray.includes(false)) {
        setInputMsg(toggleInputs[0], msg);
        return false;
    }

    return true;
}

// FUNCTION to SET specified INPUT VALUE or REMOVE it not specified
export function setInputValue(inputTag, value = "") {
    inputTag.classList.toggle("filled", value !== "");
    inputTag.value = value;
}


/* ///////////////
    FUNCTIONS FOR CREATING COMPONENTS
/////////////// */

//     SNACKBAR GENERATION FUNCTION

export function createSnackbar(options = {}) {
    // OPTION DEFAULTS
    const {
        msg,
        status = UI_STATUS_FEEDBACK.tip,
        undo
    } = options;

    // ERROR CONDITIONS - msg must exist
    if (!msg) throw new Error("Provide a message for Snackbar");

    // SNACKBAR CONSTRUCTION
    let snackbar = document.createElement("div");
    snackbar.classList.add("snackbar", status)

    // Close button, if undo() exists, else just close
    let closeBtn = undo
        ? `<button class="text close-snackbar-btn undo-btn">Undo</button>`
        : `<button class="icon close-snackbar-btn"><i class="bi bi-x-lg"></i></button>`;
    snackbar.innerHTML = `<p class="fs-400 msg">${msg}</p> ${closeBtn}`;
    document.querySelector(".snackbar-sec").prepend(snackbar);

    // SNACKBAR CLOSING - Automatic - Add animation and remove
    setTimeout(() => snackbar.style.animation = `fadeScaleOut 0.5s linear`, 4600);
    setTimeout(() => snackbar.remove(), 5000);

    // Snackbar Closing - On close / undo button click
    closeBtn = snackbar.querySelector(".close-snackbar-btn");
    closeBtn.addEventListener("click", function () {
        if (undo) undo();

        // SNACKBAR CLOSING - On Click - Add animation and remove
        snackbar.style.animation = `fadeScaleOut 0.5s linear`;
        setTimeout(() => snackbar.remove(), 500);
    })
}


//  DIALOG BOX COMPONENT CREATOR

export function createDialog(options = {}) {
    // INITIALIZATION - Set default options and handle mandatory conditons
    const {
        illustration,
        headline,
        description,
        componentID,
        componentPreset = function (component) { },
        fullscreen = false,
        primaryBtnLabel = "Continue",
        secondaryBtnLabel = "Cancel",
        primaryAction = function () { return true },
        secondaryAction = function () { return true }
    } = options;

    if (!headline) throw new Error("Provide a headline for Dialog");

    // GET AND MAKE COMPONENT VISIBLE
    const component = document.querySelector(`[data-dialog-id="${componentID}"]`);
    component?.setAttribute("aria-hidden", "false");

    componentPreset(component)

    // DIALOG SECTION CONSTRUCTION
    const dialogSec = document.createElement("section");
    dialogSec.classList.add("dialog-sec");
    if (fullscreen) dialogSec.classList.add("fullscreen")
    dialogSec.innerHTML = `
    <section class="dialog" style="animation: fadeScaleDownIn 0.5s linear">
    <h3 class="fs-500 center">${headline}</h3>
    <section class="dialog-body">
            ${illustration ? `<div><picture class="center dialog-illus"><img src="./assets/illus/${illustration}"></picture></div>` : ""}
            ${description ? `<div><p class="msg subtitle center">${description}</p></div>` : ""}
            ${component ? `<div class="dialog-component">${component?.outerHTML}</div>` : ""}
            </section>
            <div class="btn-box">
            ${secondaryBtnLabel !== false ? `<button class="ghost secondary-btn">${secondaryBtnLabel}</button>` : ""}
            <button class="primary primary-btn">${primaryBtnLabel}</button>
            </div>
            </section>
            `;

    // REMOVE COMPONENT temporarily from DOM to avoid duplicancy issues before DialogSec population
    component?.remove();
    document.body.prepend(dialogSec);
    dialogSec.style.animation = `fadeIn 0.5s linear`;

    refreshInputs();

    // Function Remove the Dialog box
    function removeDialogBox() {
        component?.setAttribute("aria-hidden", "true");
        document.body.prepend(component);
        dialogSec.style.animation = `fadeOut 0.5s linear`;
        dialogSec.querySelector(".dialog").style.animation = `fadeScaleOut 0.5s linear`;
        setTimeout(() => {
            document.body.querySelector(".dialog-sec").remove();
        }, 400);
    }

    // CLOSE DIALOG BY CANCEL BUTTON PRESS
    let secondaryBtn = dialogSec.querySelector(".secondary-btn");
    if (secondaryBtn) {
        secondaryBtn.addEventListener("click", function () {
            secondaryAction();
            removeDialogBox();
            return false;
        })
    }

    // CLOSE DIALOG BY PRIMARY BUTTON PRESS
    let primaryBtn = dialogSec.querySelector(".primary-btn");
    primaryBtn.addEventListener("click", function () {
        if (primaryAction()) {
            removeDialogBox();
            return true;
        }
    })
}

/* ///////////////
    MISCELLANEOUS HELPER UTILITY FUNCTION
/////////////// */

// Convert single digit number to 2 digit
export function toTwoDigit(num) {
    return ("0" + num).slice(-2);
}

// Generate random integer between given number
// FISHER YATES SHUFFLE 
export function getRandomInRange(min, max) {
    // Create an array [start,......,end]
    const allNumbers = [];
    for (let i = min; i <= max; i++) {
        allNumbers.push(i);
    }
    // Fisher-Yates Array shuffle
    let i = allNumbers.length;
    while (i !== 0) {
        let randomIndex = Math.floor(Math.random() * i);
        i--;
        // Swap current element with random index
        [allNumbers[i], allNumbers[randomIndex]] = [allNumbers[randomIndex], allNumbers[i]];
    }

    // Return Random Array element
    return allNumbers[Math.floor(Math.random() * allNumbers.length)];
}


((function () {


    // If Keys are not created in the Local Storages
    if (getFromStorage(STORAGE_KEY.taken_uids) == null) {
        saveToStorage(STORAGE_KEY.taken_uids, []);
    }

    if (getFromStorage(STORAGE_KEY.users) == null) {
        saveToStorage(STORAGE_KEY.users, []);
    }

    if (getFromStorage(STORAGE_KEY.current_user) == null) {
        saveToStorage(STORAGE_KEY.current_user, []);
    }


    /* ///////////////
    IF USER IS NOT LOGGED IN, and still tries to open the system
    /////////////// */

    // Checking if the user is logged in.
    let currentUser = getFromStorage(STORAGE_KEY.current_user);
    let currentFileName = getCurrentFileName();


    // If not logged in, redirect to login page
    if (currentUser.length == 0) {
        if (!["signup.html", "login.html"].includes(currentFileName)) {

            window.location.href = "./login.html";

            // Following code will be deleted later.
            // Change to "false" to disable following code.
            if (true) {

                let exampleUser = new User().getUserBasedOnKey("email", "johndoe@email.com");

                if (!exampleUser) {
                    exampleUser = new User("John Doe", "johndoe07", "johndoe@email.com");
                    exampleUser.setPassword("John07@doe");
                    // Save created user to the storage
                    exampleUser.saveNewUser();

                    // Add the unique user ID of the new user to the taken_UIDs
                    let userIDs = getFromStorage(STORAGE_KEY.taken_uids);
                    userIDs.push(exampleUser.user_id);
                    saveToStorage(STORAGE_KEY.taken_uids, userIDs);
                }

                saveToStorage(STORAGE_KEY.current_user, [exampleUser]);
                window.location.href = "./index.html";
            }
        }
    } else {
        // If logged in and still trying to access signup and login page
        if (["signup.html", "login.html"].includes(currentFileName)) {
            window.location.href = "./index.html";
        }
    }

})());
