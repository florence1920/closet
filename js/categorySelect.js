import { initializeSelectSystem } from "./selectCommon.js";

export function setupCategorySelect() {
  const mainSelect = document.getElementById("main-category-select");
  const subSelect = document.getElementById("sub-category-select");
  const mainHiddenInput = document.getElementById("main-category-hidden");
  const subHiddenInput = document.getElementById("sub-category-hidden");

  const categories = {
    outer: ["coat", "blazer", "cardigan", "padding", "windbreak", "jacket"],
    tops: [
      "long-sleeves",
      "short-sleeves",
      "sweater-shirt",
      "shirt",
      "hoodie",
      "polo-shirt",
    ],
    bottoms: ["jean", "shorts", "chino", "banding", "slacks"],
    shoes: ["loafers", "sneakers", "boots"],
  };

  const detailSizeOptions = {
    outer: ["총 기장", "어깨 넓이", "가슴 단면", "소매 길이"],
    tops: ["총 기장", "어깨 넓이", "가슴 단면", "소매 길이"],
    bottoms: ["총 기장", "허리 단면", "허벅지 단면", "밑위", "밑단 단면"],
    shoes: ["사이즈"],
  };

  if (!mainSelect || !subSelect || !mainHiddenInput || !subHiddenInput) return;

  // 초기화
  initializeSelectSystem();

  // 초기 상태에서 소분류 선택 비활성화
  const subSelectedDiv = subSelect.querySelector(".custom-select__selected");
  subSelectedDiv.classList.add("disabled");

  // 대분류 옵션 초기화
  const mainOptionsList = mainSelect.querySelector(".custom-select__options");
  if (mainOptionsList) {
    mainOptionsList.innerHTML = "";
    Object.keys(categories).forEach((category) => {
      const li = document.createElement("li");
      li.className = "custom-select__option";
      li.dataset.value = category;
      li.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      mainOptionsList.appendChild(li);
    });
  }

  // 공통: 커스텀 셀렉트 열고 닫기
  function toggleMainOptions() {
    const allSelects = document.querySelectorAll(".custom-select");
    allSelects.forEach((select) => {
      if (select !== mainSelect) {
        select.classList.remove("open");
        select.setAttribute("aria-expanded", "false");
      }
    });

    const isOpen = mainSelect.classList.toggle("open");
    mainSelect.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function toggleSubOptions() {
    if (
      mainHiddenInput.value === "" ||
      subSelectedDiv.classList.contains("disabled")
    ) {
      return;
    }

    const allSelects = document.querySelectorAll(".custom-select");
    allSelects.forEach((select) => {
      if (select !== subSelect) {
        select.classList.remove("open");
        select.setAttribute("aria-expanded", "false");
      }
    });

    const isOpen = subSelect.classList.toggle("open");
    subSelect.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function updateDetailSizeOptions(category) {
    const detailSizeList = document.querySelector(".add-form__item-detail");
    if (!detailSizeList) return;

    const options = detailSizeOptions[category] || [];
    detailSizeList.innerHTML = options
      .map(
        (option, index) => `
      <li>
        <label for="detail-size-${index}">${option}</label>
        <input 
          type="text" 
          id="detail-size-${index}" 
          name="detail-size-${index}" 
          placeholder="${category === "shoes" ? "mm" : "cm"}" 
          class="input-detail" />
      </li>
    `
      )
      .join("");
  }

  function updateSizeAndFitVisibility(category) {
    const sizeSelect = document.getElementById("size-select");
    const fitSelect = document.getElementById("fit-select");
    const sizeSelectedDiv = sizeSelect?.querySelector(
      ".custom-select__selected"
    );
    const fitSelectedDiv = fitSelect?.querySelector(".custom-select__selected");

    if (category === "shoes") {
      // shoes 선택 시 비활성화
      sizeSelectedDiv?.classList.add("disabled");
      fitSelectedDiv?.classList.add("disabled");
    } else {
      // 다른 카테고리 선택 시 활성화
      sizeSelectedDiv?.classList.remove("disabled");
      fitSelectedDiv?.classList.remove("disabled");
    }
  }

  function selectMainOption(value, text) {
    const selectedDiv = mainSelect.querySelector(".custom-select__selected");
    const textNode = selectedDiv.childNodes[0];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = text;
    } else {
      selectedDiv.prepend(document.createTextNode(text));
    }

    mainHiddenInput.value = value;
    mainSelect.classList.remove("open");
    mainSelect.setAttribute("aria-expanded", "false");

    // 이전 선택 옵션의 aria-selected 제거
    mainSelect.querySelectorAll('[role="option"]').forEach(option => {
      option.setAttribute("aria-selected", "false");
    });

    // 새로 선택된 옵션의 aria-selected 설정
    const selectedOption = mainSelect.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
      selectedOption.setAttribute("aria-selected", "true");
    }

    // 상세 사이즈 옵션 업데이트
    updateDetailSizeOptions(value);

    // 사이즈와 핏 선택 visibility 업데이트
    updateSizeAndFitVisibility(value);

    // 소분류 초기화
    const subOptionsList = subSelect.querySelector(".custom-select__options");
    subOptionsList.innerHTML = "";

    if (categories[value]) {
      subSelectedDiv.classList.remove("disabled");

      categories[value].forEach((sub) => {
        const li = document.createElement("li");
        li.className = "custom-select__option";
        li.dataset.value = sub;
        li.textContent = sub;
        subOptionsList.appendChild(li);
      });

      const textNode = subSelectedDiv.childNodes[0];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = "소분류 선택";
      } else {
        subSelectedDiv.prepend(document.createTextNode("소분류 선택"));
      }
      subHiddenInput.value = "";
    }
  }

  function selectSubOption(value, text) {
    const selectedDiv = subSelect.querySelector(".custom-select__selected");
    const textNode = selectedDiv.childNodes[0];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = text;
    } else {
      selectedDiv.prepend(document.createTextNode(text));
    }

    subHiddenInput.value = value;
    subSelect.classList.remove("open");
    subSelect.setAttribute("aria-expanded", "false");

    // 이전 선택 옵션의 aria-selected 제거
    subSelect.querySelectorAll('[role="option"]').forEach(option => {
      option.setAttribute("aria-selected", "false");
    });

    // 새로 선택된 옵션의 aria-selected 설정
    const selectedOption = subSelect.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
      selectedOption.setAttribute("aria-selected", "true");
    }
  }

  // 메인 카테고리 선택
  mainSelect.addEventListener("click", (e) => {
    e.stopPropagation();

    const selectedDiv = e.target.closest(".custom-select__selected");
    if (selectedDiv) {
      toggleMainOptions();
    } else if (e.target.classList.contains("custom-select__option")) {
      const value = e.target.dataset.value;
      const text = e.target.textContent;
      selectMainOption(value, text);
    }
  });

  // 서브 카테고리 선택
  subSelect.addEventListener("click", (e) => {
    e.stopPropagation();

    const selectedDiv = e.target.closest(".custom-select__selected");
    if (selectedDiv) {
      toggleSubOptions();
    } else if (e.target.classList.contains("custom-select__option")) {
      const value = e.target.dataset.value;
      const text = e.target.textContent;
      selectSubOption(value, text);
    }
  });
}
