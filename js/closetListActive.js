export function closetListActive() {
  const navButtons = document.querySelectorAll(".closet__nav-button");
  const lists = document.querySelectorAll(".closet__list");

  if (navButtons.length === 0) return;

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
        filtered.forEach((item, idx) => {
          const li = document.createElement("li");
          li.className = "closet__item";
          li.innerHTML = `
            <p class="closet__item-name">${item.name}</p>
            <img class="closet__item-image" src="/img/clothes/${item.category.sub}.png" alt="옷 이미지" />
            <img class="closet__item-line" src="/img/line/${item.color}.png" alt="옷 색상" />
          `;
          li.addEventListener("click", () => {
            // 기존 active 해제
            list
              .querySelectorAll(".closet__item")
              .forEach((el) => el.classList.remove("closet__item--active"));
            li.classList.add("closet__item--active");
            renderClosetDetail(item);
          });
          list.appendChild(li);
          // 첫 번째 아이템 자동 선택
          if (idx === 0) {
            li.classList.add("closet__item--active");
            renderClosetDetail(item);
          }
        });
      }
    });
  });

  navButtons[0].click();
}

function renderClosetDetail(item) {
  const detailEl = document.querySelector(".closet__detail");

  const {
    name,
    brand,
    color,
    size,
    fit,
    category,
    purchaseDate,
    detailedSize,
    note,
  } = item;
  const imgPath = `/img/clothes/${category.sub}.png`;
  const colorImg = `/img/line/${color}.png`;

  // 공통 상단 영역
  const headerHTML = `
    <div class="closet__detail__header">
    <p class="closet__detail__header-right closet__detail__category">
        ${category.main} > ${category.sub}
      </p>
      <div class="closet__detail__header-left">
        <p class="closet__detail__title">${name}</p>
        <img class="closet__detail__color" src="${colorImg}" alt="옷 색상" />
      </div>
      
    </div>
  `;

  // 사이즈 값 결정 - 신발 카테고리인 경우 detailedSize.size 사용
  const displaySize =
    category.main === "shoes" && detailedSize?.size ? detailedSize.size : size;

  // 공통 브랜드, 구매일, 사이즈, 핏
  let infoHTML = `
    <li class="closet__detail__info__item">
      <img class="closet__detail__image" src="${imgPath}" alt="옷 이미지" />
    </li>
    <li class="closet__detail__info__item">
      <p class="closet__detail__label">브랜드</p>
      <p class="closet__detail__value">${brand || "-"}</p>
    </li>
    <li class="closet__detail__info__item">
      <p class="closet__detail__label">구매일</p>
      <p class="closet__detail__value">${purchaseDate || "-"}</p>
    </li>
    <li class="closet__detail__info__item">
      <p class="closet__detail__label">사이즈</p>
      <p class="closet__detail__value">${displaySize}</p>
    </li>
  `;

  if (fit) {
    infoHTML += `
      <li class="closet__detail__info__item">
        <p class="closet__detail__label">핏</p>
        <p class="closet__detail__value">${fit}</p>
      </li>
    `;
  }

  // 카테고리별 상세사이즈 - 신발 카테고리인 경우 표시하지 않음
  if (category.main !== "shoes") {
    const sizeMap = {
      tops: ["총기장", "어깨 넓이", "가슴 단면", "소매길이"],
      outer: ["총기장", "어깨 넓이", "가슴 단면", "소매길이"],
      bottoms: ["총기장", "허리", "허벅지", "밑단", "밑위"],
    };

    const keyMap = {
      tops: ["length", "shoulder", "chest", "sleeve"],
      outer: ["length", "shoulder", "chest", "sleeve"],
      bottoms: ["length", "waist", "thigh", "hem", "rise"],
    };

    const labels = sizeMap[category.main];
    const keys = keyMap[category.main];

    if (labels && keys) {
      const sizeList = keys
        .map((key, idx) => {
          const value = detailedSize?.[key];
          return value !== undefined
            ? `<li class="closet__detail__size-item">
                <p class="closet__detail__size-label">${labels[idx]}</p>
                <p class="closet__detail__size-value">${value}${
                typeof value === "number" ? "cm" : ""
              }</p>
              </li>`
            : "";
        })
        .join("");

      infoHTML += `
        <li class="closet__detail__info__item">
          <p class="closet__detail__label">상세사이즈</p>
          <ul class="closet__detail__value">
            ${sizeList}
          </ul>
        </li>
      `;
    }
  }

  // Note가 있다면 추가
  if (note) {
    infoHTML += `
      <li class="closet__detail__info__item">
        <p class="closet__detail__label">노트</p>
        <p class="closet__detail__value">${note}</p>
      </li>
    `;
  }

  // 최종 렌더링
  detailEl.innerHTML =
    headerHTML + `<ul class="closet__detail__info">${infoHTML}</ul>`;
}
