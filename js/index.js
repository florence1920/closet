import { navHighlight } from "./navHighlight.js";
import { closetListActive } from "./closetListActive.js";
import { initializeClosetData } from "./initData.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeClosetData();

  const closetData = JSON.parse(localStorage.getItem("closet")) || [];
  console.log("현재 옷장 데이터:", closetData);
});

navHighlight();
closetListActive();
