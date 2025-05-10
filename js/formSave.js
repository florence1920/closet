import { getCorrectPath } from "./baseUrlManager.js";

export function setupFormSave() {
  const form = document.querySelector(".add-form");
  if (!form) return;

  let editMode = { isEditMode: false, itemId: null };

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const itemId = urlParams.get("id");

    if (mode === "edit" && itemId) {
      editMode = { isEditMode: true, itemId };
    }
  } catch (error) {
    console.error("URL 파라미터 확인 중 오류:", error);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!window.validateForm()) {
      return; // 유효성 검사 실패 시 저장 중단
    }

    // 폼 데이터 수집
    const mainCategory = document.getElementById("main-category-hidden").value;
    const subCategory = document.getElementById("sub-category-hidden").value;
    const color = document.getElementById("color-hidden").value;
    const brand = form.querySelector(
      'input[placeholder="브랜드를 입력"]'
    ).value;
    const nickname = form.querySelector(
      'input[placeholder="닉네임을 입력"]'
    ).value;
    const purchaseDate = form.querySelector('input[type="date"]').value;

    let size = document.getElementById("size-hidden").value;
    if (size) {
      if (size.toLowerCase() === "free") {
        size = "FREE";
      } else {
        size = size.toUpperCase();
      }
    }

    const fit = document.getElementById("fit-hidden").value;

    // 상세 사이즈 수집
    const detailInputs = form.querySelectorAll(".input-detail");
    const detailedSize = {};

    // mainCategory에 따라 다른 상세 사이즈 필드 설정
    if (mainCategory === "shoes") {
      detailedSize.size = detailInputs[0].value || "-";
    } else {
      detailedSize.length = detailInputs[0].value || "-";
      detailedSize.shoulder = detailInputs[1].value || "-";
      detailedSize.chest = detailInputs[2].value || "-";
      detailedSize.sleeve = detailInputs[3].value || "-";
    }

    // 옷 설명 수집
    const description = document.getElementById("description").value || "";

    // 데이터 객체 생성
    const newItem = {
      id: editMode.isEditMode ? editMode.itemId : crypto.randomUUID(),
      category: { main: mainCategory, sub: subCategory },
      color: color,
      brand: brand,
      name: nickname,
      size: size,
      fit: fit,
      purchaseDate: purchaseDate,
      detailedSize: detailedSize,
      note: description,
    };

    saveItemToLocalStorage(newItem, editMode.isEditMode);
  });
}

function saveItemToLocalStorage(newItem, isEditMode) {
  try {
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];

    if (isEditMode) {
      const itemIndex = closetData.findIndex((item) => item.id === newItem.id);

      if (itemIndex === -1) {
        alert("수정할 아이템을 찾을 수 없습니다.");
        return;
      }

      closetData[itemIndex] = newItem;

      localStorage.setItem("closet", JSON.stringify(closetData));

      alert("옷이 성공적으로 수정되었습니다!");
    } else {
      closetData.push(newItem);
      localStorage.setItem("closet", JSON.stringify(closetData));
      alert("옷이 성공적으로 등록되었습니다!");
    }

    window.location.href = getCorrectPath("./index.html");
  } catch (error) {
    console.error("데이터 저장 중 오류 발생:", error);
    alert("저장 중 오류가 발생했습니다.");
  }
}
