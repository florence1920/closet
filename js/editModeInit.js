// 수정 모드 감지 및 초기화 함수
import { getCorrectPath } from "./baseUrlManager.js";

export function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const itemId = urlParams.get("id");

  if (mode !== "edit" || !itemId) return false;

  try {
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];

    const item = closetData.find((item) => item.id === itemId);

    if (!item) {
      alert("수정할 아이템을 찾을 수 없습니다.");
      window.location.href = getCorrectPath("./index.html");
      return false;
    }

    document.querySelector(".section-header__title").textContent = "옷 수정";

    fillFormWithItemData(item);

    return { isEditMode: true, itemId: itemId };
  } catch (error) {
    console.error("수정 모드 초기화 중 오류 발생:", error);
    return false;
  }
}

function fillFormWithItemData(item) {
  const {
    category,
    color,
    brand,
    name,
    size,
    fit,
    purchaseDate,
    detailedSize,
    note,
  } = item;

  setMainCategoryAndTriggerEvent(category.main, category.sub);

  setTimeout(() => {
    const colorButton = document.querySelector(
      `.color-select__item[data-color="${color}"]`
    );
    if (colorButton) {
      colorButton.click();
    }
  }, 100);

  document.querySelector('input[placeholder="브랜드를 입력"]').value =
    brand || "";
  document.querySelector('input[placeholder="닉네임을 입력"]').value =
    name || "";

  document.querySelector('input[type="date"]').value = purchaseDate || "";

  setTimeout(() => {
    setSelectValue("size-select", "size-hidden", size);
    setSelectValue("fit-select", "fit-hidden", fit);
  }, 300);

  setTimeout(() => {
    const detailInputs = document.querySelectorAll(".input-detail");
    if (category.main === "shoes") {
      if (detailInputs.length > 0 && detailedSize.size) {
        detailInputs[0].value = detailedSize.size;
      }
    } else {
      if (detailedSize.length) detailInputs[0].value = detailedSize.length;
      if (detailedSize.shoulder) detailInputs[1].value = detailedSize.shoulder;
      if (detailedSize.chest) detailInputs[2].value = detailedSize.chest;
      if (detailedSize.sleeve) detailInputs[3].value = detailedSize.sleeve;
    }
  }, 400);

  document.getElementById("description").value = note || "";

  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = "수정하기";
  }
}

function setMainCategoryAndTriggerEvent(mainCategory, subCategory) {
  if (!mainCategory) return;

  document.getElementById("main-category-hidden").value = mainCategory;

  const mainCategoryDisplay = document.querySelector(
    "#main-category-select .custom-select__selected"
  );
  if (mainCategoryDisplay) {
    const mainOption = document.querySelector(
      `#main-category-select .custom-select__option[data-value="${mainCategory}"]`
    );
    if (mainOption) {
      const childNodes = Array.from(mainCategoryDisplay.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = mainOption.textContent;
      } else {
        const newTextNode = document.createTextNode(mainOption.textContent);
        mainCategoryDisplay.insertBefore(
          newTextNode,
          mainCategoryDisplay.firstChild
        );
      }
    }
  }

  const mainCategoryOption = document.querySelector(
    `#main-category-select .custom-select__option[data-value="${mainCategory}"]`
  );

  if (mainCategoryOption) {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    mainCategoryOption.dispatchEvent(clickEvent);

    setTimeout(() => {
      setSubCategory(subCategory);
    }, 200);
  }
}

// 서브 카테고리 설정 함수
function setSubCategory(subCategory) {
  if (!subCategory) return;

  document.getElementById("sub-category-hidden").value = subCategory;

  const subCategoryOption = document.querySelector(
    `#sub-category-select .custom-select__option[data-value="${subCategory}"]`
  );

  if (subCategoryOption) {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    subCategoryOption.dispatchEvent(clickEvent);
  } else {
    const subCategoryDisplay = document.querySelector(
      "#sub-category-select .custom-select__selected"
    );
    if (subCategoryDisplay) {
      const childNodes = Array.from(subCategoryDisplay.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = subCategory;
      } else {
        const newTextNode = document.createTextNode(subCategory);
        subCategoryDisplay.insertBefore(
          newTextNode,
          subCategoryDisplay.firstChild
        );
      }
    }
  }
}

function setSelectValue(selectId, hiddenInputId, value) {
  if (!value) return;

  document.getElementById(hiddenInputId).value = value;

  const option = document.querySelector(
    `#${selectId} .custom-select__option[data-value="${value}"]`
  );

  if (option) {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    option.dispatchEvent(clickEvent);
  } else {
    const selectElement = document.querySelector(
      `#${selectId} .custom-select__selected`
    );
    if (selectElement) {
      const childNodes = Array.from(selectElement.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = value;
      } else {
        const newTextNode = document.createTextNode(value);
        selectElement.insertBefore(newTextNode, selectElement.firstChild);
      }
    }
  }
}
