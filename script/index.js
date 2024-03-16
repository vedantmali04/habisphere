/* ///////////////
CONSTANTS DEFINITIONS
/////////////// */

// Database
const KEY_USER = "users";

const userJSON = {
    name: "Vedant",
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
        console.log(storedData);
        if (!storedData || storedData == "{}" || storedData == "[]") {
            throw new Error("Key not found");
        }

        // Parse retrieved data
        const parsedData = JSON.parse(storedData);
        return parsedData;

    } catch (error) {
        console.error("Error retrieving from storage:", error);
        return null;
    }
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
// currentUser = getFromStorage("current_user");
let currentUser = undefined;
let currentFileName = getCurrentFileName();

if (!currentUser) {
    if (!["signup.html", "login.html"].includes(currentFileName)) {
        window.location.href = "./signup.html";
    }
}


/* ///////////////
INPUT VALIDATION
/////////////// */

function validateInput(inputTag) {
    let pattern = new RegExp(inputTag.pattern);

    if (pattern == /(?:)/) {
        let value = inputTag.value;
        return true;
    }
}


document.addEventListener("DOMContentLoaded", function () {

    let allInputs = this.querySelectorAll("input:not([type=radio]):not([type=checkbox])");
    let allToggleInputs = this.querySelectorAll("input[type=radio], input[type=checkbox]");


    allInputs.forEach(input => {
        input.classList.add("text-input");
        input.classList.add(input.value ? "filled" : undefined);

        input.addEventListener("blur", function () {
            input.classList.toggle("filled", input.value)
        })
    })

    allToggleInputs.forEach(input => {
        input.classList.add("toggle-input");
    })

});