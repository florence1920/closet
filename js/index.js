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
import { setupBaseUrl, fixAllLinks } from "./baseUrlManager.js";

document.addEventListener("DOMContentLoaded", () => {
  // 배포 환경과 로컬 환경 자동 감지 및 base 태그 설정
  setupBaseUrl();

  // 환경에 맞게 모든 링크 수정
  fixAllLinks();

  // 네비게이션 하이라이트 즉시 적용
  navHighlight();
  navSelect();
  menuToggle();
  initializeClosetData().then(() => {
    addIdsToExistingData();

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

window.addEventListener("load", () => {
  navHighlight();
});
