import { navHighlight } from "./navHighlight.js";
import { closetListActive } from "./closetListActive.js";
import { initializeClosetData } from "./initData.js";
import { setupCategorySelect } from "./categorySelect.js";
import { setupSizeAndFitSelect } from "./sizeAndFitSelect.js";
import { setupColorSelect } from "./colorSelect.js";

document.addEventListener("DOMContentLoaded", () => {
  // 페이지 공통 초기화
  navHighlight();

  // 데이터 초기화 후 실행되어야 하는 기능들
  initializeClosetData().then(() => {
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];
    console.log("현재 옷장 데이터:", closetData);
    closetListActive();
  });

  // 폼 관련 초기화
  setupCategorySelect();
  setupSizeAndFitSelect();
  setupColorSelect();
});
