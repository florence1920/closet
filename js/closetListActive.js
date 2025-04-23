export function closetListActive() {
  const navButtons = document.querySelectorAll(".closet__nav-button");
  const lists = document.querySelectorAll(".closet__list");

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) =>
        btn.classList.remove("closet__nav-button--active")
      );
      lists.forEach((list) => list.classList.remove("closet__list--active"));

      button.classList.add("closet__nav-button--active");
      if (lists[index]) {
        lists[index].classList.add("closet__list--active");
      }
    });
  });
}
