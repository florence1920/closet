export const menuToggle = () => {
  let isOpen = false;
  const menuToggle = document.querySelector(".mobile-nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavContainer = document.querySelector(".mobile-nav-container");
  const openIcon = document.querySelector(".mobile-nav--open");
  const closeIcon = document.querySelector(".mobile-nav--close");

  // 초기 상태 설정
  openIcon.style.display = "block";
  closeIcon.style.display = "none";
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    isOpen = !isOpen;

    // 아이콘 변경 및 aria-expanded 업데이트
    if (isOpen) {
      mobileNav.classList.add("active");
      openIcon.style.display = "none";
      closeIcon.style.display = "block";
      menuToggle.setAttribute("aria-expanded", "true");
    } else {
      mobileNav.classList.remove("active");
      openIcon.style.display = "block";
      closeIcon.style.display = "none";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // 영역 외 클릭 시 메뉴 닫기
  document.addEventListener("click", (e) => {
    if (isOpen && !mobileNavContainer.contains(e.target)) {
      isOpen = false;
      mobileNav.classList.remove("active");
      openIcon.style.display = "block";
      closeIcon.style.display = "none";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  mobileNavContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
};
