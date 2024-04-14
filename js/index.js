"use strict"

/* ///////////////
CONSTANTS DEFINITIONS
/////////////// */

// Database
const KEY_USER = "users";
const KEY_TAKEN_UIDS = "taken_UIDs";
const KEY_CURRENT_USER = "current_user"

// Input Status
const ERROR = -1, TIP = 0, SUCESS = 1;

// User Data Constants
const THEME = {
    light: 1,
    dark: 2
}

// Classes and keys
const CLASS_FIELDSET = "fieldset";


/* ///////////////
HELPER FUNCTIONS
/////////////// */

// FUNCTIONS to Handle Data Storage

// FUNCTION to save data to storage throughout the project
function saveToStorage(key, data) {
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

// FUNCTION to retrieve data to storage throughout the project
function getFromStorage(key) {
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

// If Keys are not created in the Local Storages
if (getFromStorage(KEY_TAKEN_UIDS) == null) {
    saveToStorage(KEY_TAKEN_UIDS, []);
}

if (getFromStorage(KEY_USER) == null) {
    saveToStorage(KEY_USER, []);
}

if (getFromStorage(KEY_CURRENT_USER) == null) {
    saveToStorage(KEY_CURRENT_USER, []);
}

/* ///////////////
CHECK IF USER IS LOGGED IN, if not, redirect to login page
/////////////// */

// Function to get html page name
function getCurrentFileName() {
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


// Checking if the user is logged in.
let currentUser = getFromStorage(KEY_CURRENT_USER);
let currentFileName = getCurrentFileName();

// If not logged in, redirect to login page
if (currentUser.length == 0) {
    if (!["signup.html", "login.html"].includes(currentFileName)) {
        window.location.href = "./login.html";
    }
} else {
    // If logged in and still trying to access signup and login page
    if (["signup.html", "login.html"].includes(currentFileName)) {
        window.location.href = "./index.html";
    }
}

/* ///////////////
DOM Traversal
/////////////// */

// Function to search parents of a element
function getParentElement(element, targetParent) {
    let parent = element.parentNode;
    return parent.tagName.toUpperCase() == targetParent.toUpperCase()
        ? parent
        : getParentElement(parent, targetParent);
}



/* ///////////////
CLASSES, OBJECTS, USER, HABITS, etc. CODE
/////////////// */


// Function to generate uniqueIDs
function generateUniqueID(prefix = "") {
    let idArray = getFromStorage(KEY_TAKEN_UIDS);

    while (true) {
        let uid = prefix + Date.now().toString().slice(-9);
        if (!idArray.includes(uid)) {
            idArray.push(uid);
            return uid;
        }
    }
}


// Class Settings has user settings
class Settings {
    theme = THEME.light;
    animations = true;
    dashboard = {
        tasks: true,
        journal: true,
        quote: true
    };
}

// Class User has user data
class User extends Settings {
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
            this.avatar = "";
            this.created_time = Date.now();
        }
    }

    // Update password
    setPassword(password) {
        this.password = password;
    }

    // Function to save new user to storage
    saveNewUser() {
        let userArray = getFromStorage(KEY_USER);
        userArray.push(this);
        saveToStorage(KEY_USER, userArray);
    }

    // Check if user already exists
    getUserBasedOnKey(key, value) {
        let userArray = getFromStorage(KEY_USER);
        let foundUser = null;
        userArray.forEach(user => {
            if (user[key] == value) foundUser = user;
        })
        return foundUser;
    }
}

/* ///////////////
INPUT VALIDATION
/////////////// */

// Function to set error Input message
function setInputMsg(inputTag, msg, type = ERROR) {
    removeInputMsg(inputTag);

    // Create message div
    const msgDiv = document.createElement("div");
    // Set class, by default, it's "error"
    let className = "error";
    switch (type) {
        case TIP:
            className = "tip";
            break;

        case SUCESS:
            className = "success";
            break;

        default:
            break;
    }
    msgDiv.classList.add("msg", className);
    msgDiv.innerHTML = `<span>${msg}</span>`;

    // Find parent for appending
    const fieldset = getParentElement(inputTag, CLASS_FIELDSET);
    fieldset.append(msgDiv);
}

// Function to remove error Input message
function removeInputMsg(inputTag, type = ERROR) {
    const fieldset = getParentElement(inputTag, CLASS_FIELDSET);
    // Get type of msg to be deleted, by default, "error"
    let className = "error";
    switch (type) {
        case TIP:
            className = "tip";
            break;

        case SUCESS:
            className = "success";
            break;

        default:
            break;
    }
    fieldset.querySelectorAll("." + className).forEach(div => div.remove());
}

// Function to validate input tags
function validateInput(inputTag, errorMsg) {
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

function validateToggleInputs(toggleInputs, msg = "This field is required") {
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

// Function to set a input value or set it to "" if not specified
function setInputValue(inputTag, value = "") {
    inputTag.classList.toggle("filled", value !== "");
    inputTag.value = value;
}


/* ///////////////
ON DOCUMENT CONTENT LOADED
/////////////// */

document.addEventListener("DOMContentLoaded", function () {

    let allInputs = this.querySelectorAll("input:not([type=radio]):not([type=checkbox])");
    let allToggleInputs = this.querySelectorAll("input[type=radio], input[type=checkbox]");

    allInputs.forEach(input => {
        input.classList.add("text-input");
        input.classList.add(input.value ? "filled" : "unfilled");

        input.addEventListener("blur", function () {
            input.classList.toggle("filled", input.value)
        });

        if (input.type == "password") {
            let showPassBtn = this.createElement("button");
            showPassBtn.type = "button";
            showPassBtn.classList.add("show-pass-btn", "trail", "icon");
            showPassBtn.innerHTML = `<i class="bi bi-eye"></i><i class="bi bi-eye-slash"></i>`;
            getParentElement(input, CLASS_FIELDSET).append(showPassBtn);

            showPassBtn.addEventListener("click", function (e) {
                e.preventDefault();
                input.type = input.type == "password" ? "text" : "password";
                showPassBtn.classList.toggle("show", input.type != "password");
            })
        }
    })

    allToggleInputs.forEach(input => {
        input.classList.add("toggle-input");
    });
});