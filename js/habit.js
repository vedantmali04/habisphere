"use strict"

import {
    STORAGE_KEY,
    UI_CLASSES,
    UI_SIZE,
    UI_STATUS_FEEDBACK,
    TIME_WEEK_DAYS,
    TIME_MONTHS,
    QUOTES
} from "./components/data.js";
import { saveToStorage, getFromStorage, generateUniqueID, refreshInputs, createDialog } from "./components/utils.js";
import { getCurrentFileName, getParentElement } from "./components/utils.js";
import { toTwoDigit, getRandomInRange } from "./components/utils.js";


/* ///////////////
    ON DOM LOADED
/////////////// */

document.addEventListener("DOMContentLoaded", function () {

    // QUOTE SETTING
    let quoteOpenBtn = this.querySelector(".quote-open-btn");

    quoteOpenBtn?.addEventListener("click", function () {

        createDialog({
            headline: "Quote",
            componentID: "quote_box",
            secondaryBtnLabel: false,
            primaryBtnLabel: "I am on it!",
            componentPreset: function (component) {
                let quoteBox = component;
                let quoteData = QUOTES[getRandomInRange(0, QUOTES.length)]

                quoteBox.innerHTML =
                    `
                    <p class="quote">
                        <span class="icon"><i class="bi bi-quote"></i></span>
                        ${quoteData.quote}
                    </p>
                    <p class="quote-author">- ${quoteData.author}</p>
                    ${quoteData.achievement ? `<p class="quote-achievement subtitle">${quoteData.achievement}</p>` : ``}
                `;
            }
        })

    })


})