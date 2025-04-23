export function closetListActive() {
  const navButtons = document.querySelectorAll(".closet__nav-button");
  const lists = document.querySelectorAll(".closet__list");

  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  const categoryMap = {
    0: {
      category: "outer",
      list: document.querySelector(".closet__list-outer"),
    },
    1: { category: "tops", list: document.querySelector(".closet__list-tops") },
    2: {
      category: "bottoms",
      list: document.querySelector(".closet__list-bottoms"),
    },
    3: {
      category: "shoes",
      list: document.querySelector(".closet__list-shoes"),
    },
  };

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) =>
        btn.classList.remove("closet__nav-button--active")
      );
      lists.forEach((list) => list.classList.remove("closet__list--active"));
      button.classList.add("closet__nav-button--active");

      const { category, list } = categoryMap[index];

      if (list) {
        list.classList.add("closet__list--active");
        list.innerHTML = "";

        const filtered = closetData.filter((item) => {
          return item.category?.main === category.toLowerCase();
        });
        console.log("📁 필터링된 데이터:", filtered);
        filtered.forEach((item) => {
          const li = document.createElement("li");
          li.className = "closet__item";
          li.innerHTML = `
            <p class="closet__item-name">${item.name}</p>
            <img class="closet__item-image" src="/img/clothes/${item.category.sub}.png" alt="옷 이미지" />
            <img class="closet__item-line" src="/img/line/${item.color}.png" alt="옷 색상" />
          `;
          list.appendChild(li);
        });
      }
    });
  });

  navButtons[0].click();
}
