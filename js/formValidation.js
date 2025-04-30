export function setupFormValidation() {
  const form = document.querySelector(".add-form");
  if (!form) return;

  let isFirstValidation = true;

  function showError(element) {
    element.style.color = "#ff0000";
  }

  function removeError(element) {
    element.style.color = "";
  }

  // 실시간 검증
  function setupRealtimeValidation() {
    const mainCategorySelect = document.getElementById("main-category-select");
    const subCategorySelect = document.getElementById("sub-category-select");
    const colorSelect = document.querySelector(".color-select");
    const brand = form.querySelector(
      'input[placeholder="브랜드를 입력해주세요"]'
    );
    const nickname = form.querySelector(
      'input[placeholder="닉네임을 입력해주세요"]'
    );
    const purchaseDate = form.querySelector('input[type="date"]');
    const sizeSelect = document.getElementById("size-select");
    const fitSelect = document.getElementById("fit-select");

    // 카테고리 선택 시 검증
    function checkCategorySelection() {
      const mainCategory = document.getElementById(
        "main-category-hidden"
      ).value;
      const subCategory = document.getElementById("sub-category-hidden").value;
      const element = document.querySelector(
        "#main-category-select .add-form__item-title"
      );

      if (mainCategory && subCategory) {
        removeError(element);
      } else {
        showError(element);
      }
    }

    mainCategorySelect.addEventListener("click", (e) => {
      if (
        !isFirstValidation &&
        e.target.classList.contains("custom-select__option")
      ) {
        checkCategorySelection();
      }
    });

    subCategorySelect.addEventListener("click", (e) => {
      if (
        !isFirstValidation &&
        e.target.classList.contains("custom-select__option")
      ) {
        checkCategorySelection();
      }
    });

    // 색상 선택 시
    colorSelect.addEventListener("click", (e) => {
      if (
        !isFirstValidation &&
        e.target.classList.contains("color-select__item")
      ) {
        const element =
          document.querySelector(".color-select").previousElementSibling;
        if (document.getElementById("color-hidden").value) {
          removeError(element);
        } else {
          showError(element);
        }
      }
    });

    // 브랜드 입력 시
    brand.addEventListener("input", () => {
      if (!isFirstValidation) {
        const element = brand.previousElementSibling;
        if (brand.value) {
          removeError(element);
        } else {
          showError(element);
        }
      }
    });

    // 닉네임 입력 시
    nickname.addEventListener("input", () => {
      if (!isFirstValidation) {
        const element = nickname.previousElementSibling;
        if (nickname.value) {
          removeError(element);
        } else {
          showError(element);
        }
      }
    });

    // 구매일 선택 시 (선택 사항으로 변경)
    purchaseDate.addEventListener("change", () => {
      // 항상 에러 표시 제거 (필수 항목이 아니므로)
      removeError(purchaseDate.previousElementSibling);
    });

    // 사이즈 선택 시
    sizeSelect.addEventListener("click", (e) => {
      if (
        !isFirstValidation &&
        e.target.classList.contains("custom-select__option")
      ) {
        const mainCategory = document.getElementById(
          "main-category-hidden"
        ).value;
        if (mainCategory !== "shoes") {
          const element =
            document.querySelector("#size-select").previousElementSibling;
          if (document.getElementById("size-hidden").value) {
            removeError(element);
          } else {
            showError(element);
          }
        }
      }
    });

    // 핏 선택 시
    fitSelect.addEventListener("click", (e) => {
      if (
        !isFirstValidation &&
        e.target.classList.contains("custom-select__option")
      ) {
        const mainCategory = document.getElementById(
          "main-category-hidden"
        ).value;
        if (mainCategory !== "shoes") {
          const element =
            document.querySelector("#fit-select").previousElementSibling;
          if (document.getElementById("fit-hidden").value) {
            removeError(element);
          } else {
            showError(element);
          }
        }
      }
    });
  }

  function validateForm() {
    let isValid = true;
    const errorMessages = [];

    const mainCategory = document.getElementById("main-category-hidden").value;
    const subCategory = document.getElementById("sub-category-hidden").value;
    const color = document.getElementById("color-hidden").value;
    const brand = form.querySelector(
      'input[placeholder="브랜드를 입력해주세요"]'
    );
    const nickname = form.querySelector(
      'input[placeholder="닉네임을 입력해주세요"]'
    );
    const purchaseDate = form.querySelector('input[type="date"]');
    const size = document.getElementById("size-hidden").value;
    const fit = document.getElementById("fit-hidden").value;

    // 모든 에러 표시 초기화
    const allTitles = form.querySelectorAll(".add-form__item-title");
    allTitles.forEach((title) => removeError(title));

    // 카테고리 검증 (메인과 서브 모두 필요)
    if (!mainCategory || !subCategory) {
      const element = document.querySelector(
        "#main-category-select .add-form__item-title"
      );
      showError(element);
      errorMessages.push("카테고리");
      isValid = false;
    }

    // 색상 검증
    if (!color) {
      const element =
        document.querySelector(".color-select").previousElementSibling;
      showError(element);
      errorMessages.push("색상");
      isValid = false;
    }

    // 브랜드 검증
    if (!brand.value) {
      const element = brand.previousElementSibling;
      showError(element);
      errorMessages.push("브랜드");
      isValid = false;
    }

    // 닉네임 검증
    if (!nickname.value) {
      const element = nickname.previousElementSibling;
      showError(element);
      errorMessages.push("닉네임");
      isValid = false;
    }

    // 구매일 검증 (선택 사항으로 변경)
    // 구매일이 입력되지 않아도 유효성 검사를 통과하도록 제거
    // 실시간 검증에서 에러 표시 제거
    removeError(purchaseDate.previousElementSibling);

    // shoes가 아닌 경우에만 사이즈와 핏 검증
    if (mainCategory === "shoes") {
      removeError(
        document.querySelector("#size-select").previousElementSibling
      );
      removeError(document.querySelector("#fit-select").previousElementSibling);
    } else {
      if (!size) {
        const element =
          document.querySelector("#size-select").previousElementSibling;
        showError(element);
        errorMessages.push("표기 사이즈");
        isValid = false;
      }

      if (!fit) {
        const element =
          document.querySelector("#fit-select").previousElementSibling;
        showError(element);
        errorMessages.push("핏");
        isValid = false;
      }
    }

    if (!isValid) {
      alert(`다음 항목을 입력해주세요:\n${errorMessages.join(", ")}`);
    }

    return isValid;
  }

  // 실시간 검증 이벤트 리스너 설정
  setupRealtimeValidation();

  // 폼 제출 이벤트 처리
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("폼 검증 성공");
    } else {
      isFirstValidation = false;
    }
  });
}
