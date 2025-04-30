import { navHighlight } from "./navHighlight.js";
import { closetListActive } from "./closetListActive.js";
import { initializeClosetData } from "./initData.js";
import { setupCategorySelect } from "./categorySelect.js";
import { setupSizeAndFitSelect } from "./sizeAndFitSelect.js";
import { setupColorSelect } from "./colorSelect.js";
import { setupFormValidation } from "./formValidation.js";
import { setupFormSave } from "./formSave.js";
import { addIdsToExistingData } from "./addIdsToData.js";

document.addEventListener("DOMContentLoaded", () => {
  // 페이지 공통 초기화
  navHighlight();

  // 데이터 초기화 후 실행되어야 하는 기능들
  initializeClosetData().then(() => {
    // 기존 데이터에 ID 추가 (처음 한 번만 실행)
    addIdsToExistingData();

    const closetData = JSON.parse(localStorage.getItem("closet")) || [];
    console.log("현재 옷장 데이터:", closetData);
    closetListActive();
  });

  // 폼 관련 초기화
  setupCategorySelect();
  setupSizeAndFitSelect();
  setupColorSelect();
  setupFormValidation();
  setupFormSave();
});
