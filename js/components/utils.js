import {
    STORAGE_KEY,
    STATUS_UI_FEEDBACK,
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

// FUNCTION to SET specified INPUT MESSAGE
export function setInputMsg(inputTag, msg, status = STATUS_UI_FEEDBACK.error) {
    removeInputMsg(inputTag, status);

    // Create message div
    const msgDiv = document.createElement("div");
    // Set class, by default, it's "error"
    let className = UI_CLASSES.error;
    switch (status) {
        case STATUS_UI_FEEDBACK.tip:
            className = UI_CLASSES.tip;
            break;

        case STATUS_UI_FEEDBACK.success:
            className = UI_CLASSES.success;
            break;

        default:
            break;
    }
    msgDiv.classList.add("msg", className);
    msgDiv.innerHTML = `<span>${msg}</span>`;

    // Find parent for appending
    const fieldset = getParentElement(inputTag, UI_CLASSES.fieldset);
    fieldset.append(msgDiv);
}

// FUNCTION to REMOVE specified INPUT MESSAGE
export function removeInputMsg(inputTag, status = STATUS_UI_FEEDBACK.error) {
    const fieldset = getParentElement(inputTag, UI_CLASSES.fieldset);
    // Get type of msg to be deleted, by default, "error"
    let className = UI_CLASSES.error;
    switch (status) {
        case STATUS_UI_FEEDBACK.tip:
            className = UI_CLASSES.tip;
            break;

        case STATUS_UI_FEEDBACK.success:
            className = UI_CLASSES.success;
            break;

        default:
            break;
    }
    fieldset.querySelectorAll("." + className).forEach(div => div.remove());
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
