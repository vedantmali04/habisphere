import {
    STORAGE_KEY,
    UI_CLASSES,
    UI_SIZE
} from "./components/data.js";
import { saveToStorage, getFromStorage, generateUniqueID } from "./components/utils.js";
import { getCurrentFileName, getParentElement } from "./components/utils.js";

const CURRENT_USER = getFromStorage(STORAGE_KEY.current_user)[0];

document.addEventListener("DOMContentLoaded", function () {

    let chooseAvatarBox = this.querySelector(".avatar-radios-box .check-radio-box");

    for (let i = 1; i <= 12; i++) {
        let avatarSrc = `avatar-${i}.svg`;
        let isChecked = CURRENT_USER.avatar === avatarSrc;  // Concise check for checked state
        let avatarId = `avatar_${i}`
        let avatarLabel = document.createElement("label");
        avatarLabel.setAttribute("for", `avatar_${i}`);

        avatarLabel.innerHTML = `
          <input type="radio" name="choose-avatar" id="${avatarId}" ${isChecked ? 'checked' : ''}>
          <picture><img src="./assets/avatars/${avatarSrc}"></picture>
        `;

        chooseAvatarBox.append(avatarLabel);
    }
})