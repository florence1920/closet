export function setupCategorySelect() {
  console.log("Category Select Initialized");
  const mainSelect = document.getElementById("main-category-select");
  console.log(mainSelect);
  const subSelect = document.getElementById("sub-category-select");
  const mainHiddenInput = document.getElementById("main-category-hidden");
  const subHiddenInput = document.getElementById("sub-category-hidden");

  const categories = {
    outer: ["coat", "blazer", "cardigan", "padding", "windbreaker", "jacket"],
    tops: [
      "long-sleeves",
      "short-sleeves",
      "sweatshirt",
      "shirt",
      "hoodie",
      "polo-shirt",
    ],
    bottoms: ["jeans", "shorts", "chino", "banding"],
    shoes: ["loafers", "sneakers", "boots"],
  };

  if (!mainSelect || !subSelect || !mainHiddenInput || !subHiddenInput) return;

  // 초기 상태에서 소분류 선택 비활성화
  const subSelectedDiv = subSelect.querySelector(".custom-select__selected");
  subSelectedDiv.classList.add("disabled");

  // 공통: 커스텀 셀렉트 열고 닫기
  function toggleOptions(selectDiv) {
    console.log(selectDiv);
    selectDiv.classList.toggle("open");
  }

  function selectOption(selectDiv, selectedDiv, hiddenInput, value, text) {
    // 텍스트 노드만 업데이트하기
    const textNode = selectedDiv.childNodes[0];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = text;
    } else {
      // 텍스트 노드가 없다면 첫 번째 자식 앞에 새 텍스트 노드 추가
      selectedDiv.prepend(document.createTextNode(text));
    }

    hiddenInput.value = value;
    selectDiv.classList.remove("open");
  }

  // 메인 카테고리 선택
  mainSelect.addEventListener("click", (e) => {
    if (e.target.classList.contains("custom-select__selected")) {
      toggleOptions(mainSelect);
    } else if (e.target.classList.contains("custom-select__option")) {
      const value = e.target.dataset.value;
      const text = e.target.textContent;
      selectOption(
        mainSelect,
        mainSelect.querySelector(".custom-select__selected"),
        mainHiddenInput,
        value,
        text
      );

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
  });
  // 서브 카테고리 선택
  subSelect.addEventListener("click", (e) => {
    if (
      mainHiddenInput.value === "" ||
      subSelectedDiv.classList.contains("disabled")
    ) {
      return;
    }

    if (e.target.classList.contains("custom-select__selected")) {
      toggleOptions(subSelect);
    } else if (e.target.classList.contains("custom-select__option")) {
      const value = e.target.dataset.value;
      const text = e.target.textContent;
      selectOption(
        subSelect,
        subSelect.querySelector(".custom-select__selected"),
        subHiddenInput,
        value,
        text
      );
    }
  });

  // 다른 곳 클릭하면 닫히게
  document.addEventListener("click", (e) => {
    if (!mainSelect.contains(e.target)) {
      mainSelect.classList.remove("open");
    }
    if (!subSelect.contains(e.target)) {
      subSelect.classList.remove("open");
    }
  });
}
