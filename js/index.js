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


/* ///////////////
HELPER FUNCTIONS
/////////////// */

// FUNCTIONS to Handle Database

// FUNCTION to save data to storage throughout the project
function saveToStorage(key, data) {
    try {
        if (!key || typeof key !== "string") {
            throw new Error("Invalid key: Key must be a non-empty string.");
        }

        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);

    } catch (error) {
        console.error("Error saving to storage:", error);
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

// If User Arrays are not created in the Application

if (getFromStorage(KEY_TAKEN_UIDS) == null) {
    saveToStorage(KEY_TAKEN_UIDS, []);
}

if (getFromStorage(KEY_USER) == null) {
    saveToStorage(KEY_USER, []);
}

if (getFromStorage(KEY_CURRENT_USER) == null) {
    saveToStorage(KEY_CURRENT_USER, []);
}

// OTHER MISCELLANEOUS FUNCTIONS

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

if (currentUser == []) {
    if (!["signup.html", "login.html"].includes(currentFileName)) {
        window.location.href = "./signup.html";
    }
}

// DOM Traversal

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


// Class settings has User settings
class Settings {
    theme = THEME.light;
    animations = true;
    dashboard = {
        tasks: true,
        journal: true,
        quote: true
    };
}


class User extends Settings {
    user_id;
    full_name;
    username;
    email;
    password;
    bio;
    avatar;
    created_time;

    constructor(full_name, username, email) {
        super();
        this.user_id = generateUniqueID("uid");
        this.full_name = full_name;
        this.username = username;
        this.email = email;
        this.password = "";
        this.bio = "";
        this.avatar = "";
        this.created_time = Date.now();
    }

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

    const fieldset = getParentElement(inputTag, "fieldset");

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

    const errorDiv = document.createElement("div");
    errorDiv.classList.add("msg", "error");
    errorDiv.innerHTML = `<span>${msg}</span>`;
    fieldset.append(errorDiv);
}

// Function to remove error Input message
function removeInputMsg(inputTag, type = ERROR) {
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
    const fieldset = getParentElement(inputTag, "fieldset");
    fieldset.querySelectorAll("." + className).forEach(div => div.remove());
}

// Function to validate input tags
function validateInput(inputTag, errorMsg) {
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
    })

    allToggleInputs.forEach(input => {
        input.classList.add("toggle-input");
    })
});