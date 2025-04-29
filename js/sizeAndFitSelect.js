import { initializeSelectSystem } from "./selectCommon.js";

export function setupSizeAndFitSelect() {
  // 초기화
  initializeSelectSystem();

  setupSelect("size-select", "size-hidden");
  setupSelect("fit-select", "fit-hidden");
}

function setupSelect(selectId, hiddenInputId) {
  const selectDiv = document.getElementById(selectId);
  const hiddenInput = document.getElementById(hiddenInputId);

  if (!selectDiv || !hiddenInput) return;

  // 셀렉트 열고 닫기
  function toggleOptions() {
    // 다른 모든 셀렉트 닫기
    const allSelects = document.querySelectorAll(".custom-select");
    allSelects.forEach((select) => {
      if (select !== selectDiv) {
        select.classList.remove("open");
      }
    });

    selectDiv.classList.toggle("open");
  }

  // 옵션 선택
  function selectOption(value, text) {
    const selectedDiv = selectDiv.querySelector(".custom-select__selected");
    // 텍스트 노드만 업데이트
    const textNode = selectedDiv.childNodes[0];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = text;
    } else {
      selectedDiv.prepend(document.createTextNode(text));
    }

    hiddenInput.value = value;
    selectDiv.classList.remove("open");
  }

  // 이벤트 리스너 추가
  selectDiv.addEventListener("click", (e) => {
    e.stopPropagation();

    // 클릭된 요소나 그 부모가 custom-select__selected 클래스를 가지고 있는지 확인
    const selectedDiv = e.target.closest(".custom-select__selected");
    if (selectedDiv) {
      toggleOptions();
    } else if (e.target.classList.contains("custom-select__option")) {
      const value = e.target.dataset.value;
      const text = e.target.textContent;
      selectOption(value, text);
    }
  });
}
