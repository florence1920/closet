export function setupFormSave() {
  const form = document.querySelector(".add-form");
  if (!form) return;

  // 수정 모드 확인용 변수
  let editMode = { isEditMode: false, itemId: null };

  // URL에서 수정 모드 확인 (외부 함수에서 가져올 수 있음)
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

    // validateForm 함수가 전역으로 노출되어 있으므로 호출
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

    // 사이즈 값을 대문자로 변환
    let size = document.getElementById("size-hidden").value;
    // 사이즈 값이 s, m, l, xl, xxl과 같은 경우 대문자로 변환
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
      // 신발 사이즈는 숫자만 저장 (단위는 표시할 때 추가)
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
    // 기존 데이터 불러오기
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];

    if (isEditMode) {
      // 수정 모드: 기존 아이템 찾아서 업데이트
      const itemIndex = closetData.findIndex((item) => item.id === newItem.id);

      if (itemIndex === -1) {
        alert("수정할 아이템을 찾을 수 없습니다.");
        return;
      }

      // 아이템 업데이트
      closetData[itemIndex] = newItem;

      // 업데이트된 데이터 저장
      localStorage.setItem("closet", JSON.stringify(closetData));

      alert("옷이 성공적으로 수정되었습니다!");
    } else {
      // 신규 추가 모드
      closetData.push(newItem);
      localStorage.setItem("closet", JSON.stringify(closetData));
      alert("옷이 성공적으로 등록되었습니다!");
    }

    // 홈 페이지로 리디렉션
    window.location.href = "/index.html";
  } catch (error) {
    console.error("데이터 저장 중 오류 발생:", error);
    alert("저장 중 오류가 발생했습니다.");
  }
}
