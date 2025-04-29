// 전역 document click 이벤트 핸들러
let isInitialized = false;

export function initializeSelectSystem() {
  if (isInitialized) return;

  document.addEventListener("click", (e) => {
    const allSelects = document.querySelectorAll(".custom-select");
    allSelects.forEach((select) => {
      if (!select.contains(e.target)) {
        select.classList.remove("open");
      }
    });
  });

  isInitialized = true;
}
