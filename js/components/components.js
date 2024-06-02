import {
    STORAGE_KEY,
    STATUS_UI_FEEDBACK,
    UI_CLASSES,
    UI_SIZE
} from "./data.js";
import { saveToStorage, getFromStorage, generateUniqueID } from "./utils.js";
import { getCurrentFileName, getParentElement } from "./utils.js";
import { User } from "./utils.js";
import { setInputMsg, removeInputMsg, validateInput, validateToggleInputs, setInputValue } from "./utils.js";

const USER = getFromStorage(STORAGE_KEY.current_user);

/* ///////////////
    UTITILY FUNCTIONS for Components codes
/////////////// */

export function compNavDrawer(user) {
    return `
    <!-- NAVIGATION DRAWER STARTS -->
    <nav class="nav-drawer">
    
        <!-- LOGO and Close Button -->
        <header class="nav-header">
            <button class="icon nav-close-btn"><i class="bi bi-arrow-left"></i></button>
        </header>
        <div class="divider"></div>
    
        <section class="menu-holder">
    
    
            <!-- User Avatar, Name, Email and Settings link -->
            <menu id="menu_user_info">
                <a class="menu-item" href="./settings.html">
                    <picture class="avatar avatar-column"><img src="./assets/avatars/${user.avatar}" alt="${user.full_name}">
                    </picture>
                    <span class="info-column">
                        <span class="name">${user.full_name}</span>
                        <span class="email fs-300">${user.email}</span>
                    </span>
                    <button class="icon settings-btn"><i class="bi bi-gear"></i></button>
                </a>
            </menu>
    
            <!-- Pages Menu -->
            <menu id="menu_pages">
                <a class="menu-item active" href="#">
                    <span class="icon"><i class="bi bi-grid-1x2"></i></span>
                    <span class="icon filled"><i class="bi bi-grid-1x2-fill"></i></span> Habits
                </a>
                <a class="menu-item" href="#">
                    <span class="icon"><i class="bi bi-check-square"></i></span>
                    <span class="icon filled"><i class="bi bi-check-square-fill"></i></span> To-do
                </a>
                <a class="menu-item" href="#">
                    <span class="icon"><i class="bi bi-sticky"></i></span>
                    <span class="icon filled"><i class="bi bi-sticky-fill"></i></span> Notebook
                </a>
                <a class="menu-item" href="#">
                    <span class="icon"><i class="bi bi-bar-chart-line"></i></span>
                    <span class="icon filled"><i class="bi bi-bar-chart-line-fill"></i></span> Statistics
                </a>
                <a class="menu-item" href="#">
                    <span class="icon"><i class="bi bi-journal-bookmark"></i></span>
                    <span class="icon filled"><i class="bi bi-journal-bookmark-fill"></i></span> Journal
                </a>
                <a class="menu-item" href="#">
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
    `
}
