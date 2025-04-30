export function setupFormSave() {
  const form = document.querySelector(".add-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    // 폼 데이터 수집
    const mainCategory = document.getElementById("main-category-hidden").value;
    const subCategory = document.getElementById("sub-category-hidden").value;
    const color = document.getElementById("color-hidden").value;
    const brand = form.querySelector(
      'input[placeholder="브랜드를 입력해주세요"]'
    ).value;
    const nickname = form.querySelector(
      'input[placeholder="닉네임을 입력해주세요"]'
    ).value;
    const purchaseDate = form.querySelector('input[type="date"]').value;
    const size = document.getElementById("size-hidden").value;
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

    // 데이터 객체 생성 - 고유 ID 추가
    const newItem = {
      id: crypto.randomUUID(),
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

    saveItemToLocalStorage(newItem);
  });
}

function saveItemToLocalStorage(newItem) {
  try {
    // 기존 데이터 불러오기
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];

    // 새 아이템 추가
    closetData.push(newItem);

    // 업데이트된 데이터 저장
    localStorage.setItem("closet", JSON.stringify(closetData));

    alert("옷이 성공적으로 등록되었습니다!");

    window.location.href = "/index.html";
  } catch (error) {
    console.error("데이터 저장 중 오류 발생:", error);
    alert("저장 중 오류가 발생했습니다.");
  }
}
