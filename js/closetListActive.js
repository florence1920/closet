export function closetListActive() {
  const navButtons = document.querySelectorAll(".closet__nav-button");
  const lists = document.querySelectorAll(".closet__list");

  // 호버용 상세 정보 요소 생성 (모바일 전용 모달용으로만 사용)
  const hoverDetailEl = document.createElement("div");
  hoverDetailEl.className = "closet__detail hover-detail";
  document.querySelector(".closet__box").appendChild(hoverDetailEl);

  // 메인 상세 정보 요소
  const mainDetailEl = document.querySelector(
    ".closet__detail:not(.hover-detail)"
  );

  // 모달 오버레이 요소
  const modalOverlay = document.querySelector(".modal-overlay");

  if (navButtons.length === 0) return;

  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  // 화면 크기 체크 함수
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
            // 모바일 환경에서는 모달 표시 (active 클래스 추가 없음)
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
          // 첫 번째 아이템 자동 선택 (모바일에서는 적용 안함)
          if (idx === 0 && !isMobileView()) {
            li.classList.add("closet__item--active");
            renderClosetDetail(item, mainDetailEl);
          }
        });
      }
    });
  });

  navButtons[0].click();

  // 모달 오버레이 클릭 이벤트
  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
      hoverDetailEl.classList.remove("active");
    });
  }

  // 화면 크기 변경 시 모달 닫기
  window.addEventListener("resize", () => {
    if (!isMobileView()) {
      modalOverlay.classList.remove("active");
      hoverDetailEl.classList.remove("active");
    }
  });
}

// 상세 정보 요소를 포인터 위치에 배치하는 함수 - 사용하지 않음
// 모바일에서는 CSS로 중앙 배치
function positionDetailElement(detailEl, event) {
  // 함수는 남겨두지만 사용하지 않음
}

// 특정 요소에 상세 정보 렌더링
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
  const imgPath = `/img/clothes/${category.sub}.png`;
  const colorImg = `/img/line/${color}.png`;

  detailEl.dataset.itemId = id || "";

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

  // 수정/삭제 버튼 추가
  infoHTML += `
    <li class="closet__detail__info__item button-group">
      <button>
        <span>수정</span> <img src="/img/icon/edit.png" alt="수정하기" />
      </button>
      <button>
        <span>삭제</span> <img src="/img/icon/delete.png" alt="삭제하기" />
      </button>
    </li>
  `;

  // 최종 렌더링
  detailEl.innerHTML =
    headerHTML + `<ul class="closet__detail__info">${infoHTML}</ul>`;
}
