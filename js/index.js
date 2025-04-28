import { navHighlight } from "./navHighlight.js";
import { closetListActive } from "./closetListActive.js";
import { initializeClosetData } from "./initData.js";
import { setupCategorySelect } from "./categorySelect.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeClosetData().then(() => {
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];
    console.log("현재 옷장 데이터:", closetData);

    navHighlight();
    setupCategorySelect();
    closetListActive();
  });
});
