export function setupColorSelect() {
  const colorButtons = document.querySelectorAll(".color-select__item");
  const hiddenInput = document.getElementById("color-hidden");

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const previousSelected = document.querySelector(
        ".color-select__item.selected"
      );
      if (previousSelected) {
        previousSelected.classList.remove("selected");
        previousSelected.setAttribute("aria-checked", "false");
      }

      button.classList.add("selected");
      button.setAttribute("aria-checked", "true");

      hiddenInput.value = button.dataset.color;
    });
  });
}
