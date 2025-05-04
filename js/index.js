import { navHighlight } from "./navHighlight.js";
import { closetListActive } from "./closetListActive.js";
import { initializeClosetData } from "./initData.js";
import { setupCategorySelect } from "./categorySelect.js";
import { setupSizeAndFitSelect } from "./sizeAndFitSelect.js";
import { setupColorSelect } from "./colorSelect.js";
import { setupFormValidation } from "./formValidation.js";
import { setupFormSave } from "./formSave.js";
import { addIdsToExistingData } from "./addIdsToData.js";
import { setupItemActions } from "./itemActions.js";
import { navSelect } from "./statNavSelect.js";
import { menuToggle } from "./menuToggle.js";
document.addEventListener("DOMContentLoaded", () => {
  navHighlight();
  navSelect();
  menuToggle();
  initializeClosetData().then(() => {
    // 기존 데이터에 ID 추가 (처음 한 번만 실행)
    addIdsToExistingData();

    // closet__box 요소가 있는 경우에만 closetListActive 함수 실행
    if (document.querySelector(".closet__box")) {
      closetListActive();
      setupItemActions();
    }
  });

  // 폼 관련 초기화
  setupCategorySelect();
  setupSizeAndFitSelect();
  setupColorSelect();
  setupFormValidation();
  setupFormSave();
});
