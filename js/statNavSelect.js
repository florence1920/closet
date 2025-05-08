export function navSelect() {
  const nav = document.querySelector(".statistics__nav");

  // 요소가 존재하지 않으면 함수 종료
  if (!nav) {
    return;
  }

  const navItems = nav.querySelectorAll(".statistics__nav-item");
  const clothesContainer = document.querySelector(
    ".statistics__container.clothes"
  );
  const bestfitContainer = document.querySelector(
    ".statistics__container.bestfit"
  );

  // 필요한 컨테이너가 없으면 함수 종료
  if (!clothesContainer || !bestfitContainer) {
    console.warn(
      "Required containers not found. Skipping navSelect initialization."
    );
    return;
  }

  // 초기 상태 설정
  clothesContainer.style.display = "flex";
  bestfitContainer.style.display = "none";
  clothesContainer.removeAttribute("aria-hidden");
  bestfitContainer.setAttribute("aria-hidden", "true");

  // 페이지 로드 시 초기 선택된 탭 확인
  const initialSelectedItem = nav.querySelector(
    ".statistics__nav-item.selected"
  );
  if (initialSelectedItem) {
    const isClothesTab =
      initialSelectedItem.querySelector(".statistics__nav-item-title")
        .textContent === "옷 통계";

    if (!isClothesTab) {
      nav.classList.add("no-bottom-padding");
    }
  }

  // 베스트 핏 아이템 필터링 함수
  function getBestFitItems() {
    const closetData = JSON.parse(localStorage.getItem("closet")) || [];
    return closetData.filter((item) => {
      const note = item.note?.toLowerCase() || "";
      return note.includes("좋음") || note.includes("최고");
    });
  }

  // 베스트 핏 아이템 렌더링 함수
  function renderBestFitItems() {
    const bestFitItems = getBestFitItems();
    bestfitContainer.innerHTML = "";

    if (bestFitItems.length === 0) {
      bestfitContainer.innerHTML =
        '<p class="no-items">좋음 또는 최고로 표시된 아이템이 없습니다.</p>';
      return;
    }

    // Swiper 컨테이너 생성
    const swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper bestfit-swiper";
    bestfitContainer.appendChild(swiperContainer);

    // Swiper 내부 wrapper
    const swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper-wrapper";
    swiperContainer.appendChild(swiperWrapper);

    // 아이템들을 슬라이드로 추가
    bestFitItems.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      swiperWrapper.appendChild(slide);

      // 카드 생성
      const card = createItemCard(item);
      slide.appendChild(card);
    });

    // 네비게이션 화살표 추가
    const prevBtn = document.createElement("div");
    prevBtn.className = "swiper-button-prev";
    swiperContainer.appendChild(prevBtn);

    const nextBtn = document.createElement("div");
    nextBtn.className = "swiper-button-next";
    swiperContainer.appendChild(nextBtn);

    // Swiper 초기화 - 반응형으로 설정
    const swiper = new Swiper(".bestfit-swiper", {
      slidesPerView: "auto",
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      grabCursor: true,
      // 반응형 설정 추가
      breakpoints: {
        400: {
          slidesPerView: "auto",
        },
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });
  }

  // 아이템 카드 생성 함수
  function createItemCard(item) {
    if (!item) return null;

    const card = document.createElement("div");
    card.className = "closet__detail";

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

    // 필수 데이터가 없는 경우 기본값 사용
    if (!category || !category.sub || !category.main) {
      card.innerHTML = "<p>데이터 오류: 카테고리 정보가 없습니다.</p>";
      return card;
    }

    const imgPath = `./img/clothes/${category.sub}.png`;
    const colorImg = `./img/line/${color || "black"}.png`;

    // 노트에 "최고"가 포함되어 있는지 확인
    const isBest = note?.toLowerCase().includes("최고") || false;

    // 헤더 영역 (크라운 아이콘은 카드에 직접 추가)
    const headerHTML = `
      ${
        isBest
          ? '<img src="./img/icon/crown.png" class="crown-icon" alt="최고 아이템" />'
          : ""
      }
      <div class="closet__detail__header">
        <p class="closet__detail__header-right closet__detail__category">
          ${category.main} > ${category.sub}
        </p>
        <div class="closet__detail__header-left">
          <p class="closet__detail__title">${name || "이름 없음"}</p>
          <img class="closet__detail__color" src="${colorImg}" alt="color ${color}" />
        </div>
      </div>
    `;

    const displaySize =
      category.main === "shoes" && detailedSize?.size
        ? detailedSize.size
        : size;

    let infoHTML = `
      <ul class="closet__detail__info">
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
          <p class="closet__detail__value">${displaySize || "-"}</p>
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

    if (category.main !== "shoes" && detailedSize) {
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
            const value = detailedSize[key];
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
      infoHTML += `        <li class="closet__detail__info__item">
          <p class="closet__detail__label">노트</p>
          <p class="closet__detail__value">${note}</p>
        </li>
      `;
    }

    infoHTML += `</ul>`;

    card.innerHTML = headerHTML + infoHTML;
    return card;
  }

  nav.addEventListener("click", (e) => {
    const clickedItem = e.target.closest(".statistics__nav-item");
    if (!clickedItem) return;

    // 모든 탭 초기화
    navItems.forEach((item) => {
      item.classList.remove("selected");
      const tabButton = item.querySelector("[role='tab']");
      tabButton.setAttribute("aria-selected", "false");
    });

    // 선택된 탭 활성화
    clickedItem.classList.add("selected");
    const selectedTabButton = clickedItem.querySelector("[role='tab']");
    selectedTabButton.setAttribute("aria-selected", "true");

    const isClothesTab =
      clickedItem.querySelector(".statistics__nav-item-title").textContent ===
      "옷 통계";

    if (isClothesTab) {
      clothesContainer.style.display = "flex";
      bestfitContainer.style.display = "none";
      clothesContainer.removeAttribute("aria-hidden");
      bestfitContainer.setAttribute("aria-hidden", "true");
      nav.classList.remove("no-bottom-padding");
    } else {
      clothesContainer.style.display = "none";
      bestfitContainer.style.display = "flex";
      clothesContainer.setAttribute("aria-hidden", "true");
      bestfitContainer.removeAttribute("aria-hidden");
      nav.classList.add("no-bottom-padding");
      renderBestFitItems();
    }
  });
}
