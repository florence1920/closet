export function setupColorSelect() {
  const colorButtons = document.querySelectorAll(".color-select__item");
  const hiddenInput = document.getElementById("color-hidden");

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 이전에 선택된 버튼의 선택 상태 제거
      const previousSelected = document.querySelector(
        ".color-select__item.selected"
      );
      if (previousSelected) {
        previousSelected.classList.remove("selected");
      }

      // 현재 버튼 선택 상태로 변경
      button.classList.add("selected");

      // hidden input에 선택된 색상 값 설정
      hiddenInput.value = button.dataset.color;
    });
  });
}
