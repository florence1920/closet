// 수정 모드 감지 및 초기화 함수

export function checkEditMode() {
  // URL에서 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const itemId = urlParams.get("id");

  // 수정 모드가 아니면 종료
  if (mode !== "edit" || !itemId) return false;

  try {
    // localStorage에서 데이터 가져오기
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];

    // ID로 아이템 찾기
    const item = closetData.find((item) => item.id === itemId);

    if (!item) {
      alert("수정할 아이템을 찾을 수 없습니다.");
      window.location.href = "/index.html";
      return false;
    }

    // 폼 제목 변경
    document.querySelector(".section-header__title").textContent = "옷 수정";

    // 폼 데이터 설정
    fillFormWithItemData(item);

    // 수정 모드 플래그 반환
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

  // 메인 카테고리 설정 및 이벤트 트리거
  setMainCategoryAndTriggerEvent(category.main, category.sub);

  // 색상 설정
  setTimeout(() => {
    const colorButton = document.querySelector(
      `.color-select__item[data-color="${color}"]`
    );
    if (colorButton) {
      colorButton.click();
    }
  }, 100);

  // 텍스트 입력 설정
  document.querySelector('input[placeholder="브랜드를 입력"]').value =
    brand || "";
  document.querySelector('input[placeholder="닉네임을 입력"]').value =
    name || "";

  // 날짜 설정
  document.querySelector('input[type="date"]').value = purchaseDate || "";

  // 사이즈 및 핏 설정
  setTimeout(() => {
    setSelectValue("size-select", "size-hidden", size);
    setSelectValue("fit-select", "fit-hidden", fit);
  }, 300);

  // 상세 사이즈 설정
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

  // 노트 설정
  document.getElementById("description").value = note || "";

  // 제출 버튼 텍스트 변경
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = "수정하기";
  }
}

// 메인 카테고리 설정 및 이벤트 트리거 함수
function setMainCategoryAndTriggerEvent(mainCategory, subCategory) {
  if (!mainCategory) return;

  // 1. 메인 카테고리 히든 필드 설정
  document.getElementById("main-category-hidden").value = mainCategory;

  // 2. 메인 카테고리 선택 요소 표시 텍스트 업데이트
  const mainCategoryDisplay = document.querySelector(
    "#main-category-select .custom-select__selected"
  );
  if (mainCategoryDisplay) {
    const mainOption = document.querySelector(
      `#main-category-select .custom-select__option[data-value="${mainCategory}"]`
    );
    if (mainOption) {
      // 화살표 이미지 유지를 위해 첫 번째 텍스트 노드만 업데이트
      const childNodes = Array.from(mainCategoryDisplay.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = mainOption.textContent;
      } else {
        // 텍스트 노드가 없으면 기존 내용을 유지하고 앞에 텍스트 노드 추가
        const newTextNode = document.createTextNode(mainOption.textContent);
        mainCategoryDisplay.insertBefore(
          newTextNode,
          mainCategoryDisplay.firstChild
        );
      }
    }
  }

  // 3. 메인 카테고리 옵션 클릭 이벤트 트리거 - 서브 카테고리 옵션 생성
  const mainCategoryOption = document.querySelector(
    `#main-category-select .custom-select__option[data-value="${mainCategory}"]`
  );

  if (mainCategoryOption) {
    // 실제 클릭 이벤트 발생시키기
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    mainCategoryOption.dispatchEvent(clickEvent);

    // 서브 카테고리 설정 (메인 카테고리 선택 이벤트 발생 후 약간의 지연 필요)
    setTimeout(() => {
      setSubCategory(subCategory);
    }, 200);
  }
}

// 서브 카테고리 설정 함수
function setSubCategory(subCategory) {
  if (!subCategory) return;

  // 1. 서브 카테고리 히든 필드 설정
  document.getElementById("sub-category-hidden").value = subCategory;

  // 2. 서브 카테고리 옵션 클릭 이벤트 트리거
  const subCategoryOption = document.querySelector(
    `#sub-category-select .custom-select__option[data-value="${subCategory}"]`
  );

  if (subCategoryOption) {
    // 실제 클릭 이벤트 발생시키기
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    subCategoryOption.dispatchEvent(clickEvent);
  } else {
    // 옵션을 찾지 못했을 경우 직접 표시 텍스트 업데이트
    const subCategoryDisplay = document.querySelector(
      "#sub-category-select .custom-select__selected"
    );
    if (subCategoryDisplay) {
      // 화살표 이미지 유지를 위해 첫 번째 텍스트 노드만 업데이트
      const childNodes = Array.from(subCategoryDisplay.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = subCategory;
      } else {
        // 텍스트 노드가 없으면 기존 내용을 유지하고 앞에 텍스트 노드 추가
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

  // hidden input 값 설정
  document.getElementById(hiddenInputId).value = value;

  // 옵션 클릭 이벤트 트리거
  const option = document.querySelector(
    `#${selectId} .custom-select__option[data-value="${value}"]`
  );

  if (option) {
    // 실제 클릭 이벤트 발생시키기
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    option.dispatchEvent(clickEvent);
  } else {
    // 옵션을 찾지 못했을 경우 직접 표시 텍스트 업데이트
    const selectElement = document.querySelector(
      `#${selectId} .custom-select__selected`
    );
    if (selectElement) {
      // 화살표 이미지 유지를 위해 첫 번째 텍스트 노드만 업데이트
      const childNodes = Array.from(selectElement.childNodes);
      const textNode = childNodes.find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.nodeValue = value;
      } else {
        // 텍스트 노드가 없으면 기존 내용을 유지하고 앞에 텍스트 노드 추가
        const newTextNode = document.createTextNode(value);
        selectElement.insertBefore(newTextNode, selectElement.firstChild);
      }
    }
  }
}
