export function closetListActive() {
  const navButtons = document.querySelectorAll(".closet__nav-button");
  const lists = document.querySelectorAll(".closet__list");

  const hoverDetailEl = document.createElement("div");
  hoverDetailEl.className = "closet__detail hover-detail";
  document.querySelector(".closet__box").appendChild(hoverDetailEl);

  const mainDetailEl = document.querySelector(
    ".closet__detail:not(.hover-detail)"
  );

  const modalOverlay = document.querySelector(".modal-overlay");

  if (navButtons.length === 0) return;

  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  const isMobileView = () => window.innerWidth <= 767;

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
      // 모든 탭 버튼의 상태 초기화
      navButtons.forEach((btn) => {
        btn.classList.remove("closet__nav-button--active");
        btn.setAttribute("aria-selected", "false");
      });
      
      // 모든 패널 숨기기
      lists.forEach((list) => list.classList.remove("closet__list--active"));
      
      // 선택된 탭 활성화
      button.classList.add("closet__nav-button--active");
      button.setAttribute("aria-selected", "true");

      const { category, list } = categoryMap[index];

      if (list) {
        list.classList.add("closet__list--active");
        list.innerHTML = "";

        const filtered = closetData.filter((item) => {
          return item.category?.main === category.toLowerCase();
        });
        filtered.forEach((item, idx) => {
          const li = document.createElement("li");
          li.className = "closet__item";
          li.setAttribute("data-id", item.id || "");
          li.innerHTML = itemTemplate(item);

          // 클릭/터치 이벤트 처리
          li.addEventListener("click", (e) => {
            // 데스크톱 환경에서는 메인 상세 정보 표시
            if (!isMobileView()) {
              // 기존 active 해제
              list
                .querySelectorAll(".closet__item")
                .forEach((el) => el.classList.remove("closet__item--active"));
              li.classList.add("closet__item--active");

              // 메인 상세 정보 렌더링
              renderClosetDetail(item, mainDetailEl);
            }
            else {
              renderClosetDetail(item, hoverDetailEl);

              // 모달 표시
              hoverDetailEl.classList.add("active");
              modalOverlay.classList.add("active");

              // 다른 영역 클릭 시 닫기
              const closeOnClickOutside = (evt) => {
                if (
                  !hoverDetailEl.contains(evt.target) &&
                  !li.contains(evt.target)
                ) {
                  hoverDetailEl.classList.remove("active");
                  modalOverlay.classList.remove("active");
                  document.removeEventListener("click", closeOnClickOutside);
                }
              };

              // 다음 클릭부터 감지
              setTimeout(() => {
                document.addEventListener("click", closeOnClickOutside);
              }, 100);
            }
          });

          list.appendChild(li);
          if (idx === 0 && !isMobileView()) {
            li.classList.add("closet__item--active");
            renderClosetDetail(item, mainDetailEl);
          }
        });
      }
    });
  });

  // 초기 탭 선택
  navButtons[0].click();

  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
      hoverDetailEl.classList.remove("active");
    });
  }

  window.addEventListener("resize", () => {
    if (!isMobileView()) {
      modalOverlay.classList.remove("active");
      hoverDetailEl.classList.remove("active");
    }
  });
}

function renderClosetDetail(item, detailEl) {
  if (!detailEl) return;

  const {
    id,
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
  const imgPath = "./img/clothes/" + category.sub + ".png";
  const colorImg = "./img/line/" + color + ".png";

  detailEl.dataset.itemId = id || "";

  const headerHTML = `
    <div class="closet__detail__header">
    <p class="closet__detail__header-right closet__detail__category">
        ${category.main} > ${category.sub}
      </p>
      <div class="closet__detail__header-left">
        <p class="closet__detail__title">${name}</p>
        <img class="closet__detail__color" src="${colorImg}" alt="color ${color}" />
      </div>
      
    </div>
  `;

  const displaySize =
    category.main === "shoes" && detailedSize?.size ? detailedSize.size : size;

  let infoHTML = `
    <li class="closet__detail__info__item">
      <img class="closet__detail__image" src="${imgPath}" alt="${category.sub} icon" />
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

  if (note) {
    infoHTML += `
      <li class="closet__detail__info__item">
        <p class="closet__detail__label">노트</p>
        <p class="closet__detail__value">${note}</p>
      </li>
    `;
  }

  infoHTML += `<li class="closet__detail__info__item button-group">
      <button class="edit-button" data-id="${id}" style="color: #000 !important; background-color: #fff !important; -webkit-text-fill-color: #000 !important;">
        수정 <img src="./img/icon/edit.png" alt="" />
      </button>
      <button class="delete-button" data-id="${id}" style="color: #000 !important; background-color: #fff !important; -webkit-text-fill-color: #000 !important;">
        삭제
        <img src="./img/icon/delete.png" alt="" />
      </button>
    </li>`;

  // 최종 렌더링
  detailEl.innerHTML =
    headerHTML + `<ul class="closet__detail__info">${infoHTML}</ul>`;
}

const itemTemplate = (item) => {
  return `
      <p class="closet__item-name">${item.name}</p>
      <img class="closet__item-image" src="./img/clothes/${item.category.sub}.png" alt="${item.category.sub} icon" />
      <img class="closet__item-line" src="./img/line/${item.color}.png" alt="color ${item.color}" />
  `;
};
