// 옷장 아이템 관리 (삭제, 수정) 기능

export function setupItemActions() {
  // MutationObserver를 사용하여 DOM 변경 감지
  const targetNode = document.querySelector(".closet__detail");
  const hoverDetailNode = document.querySelector(
    ".closet__detail.hover-detail"
  );

  if (!targetNode && !hoverDetailNode) return;

  // 페이지 로드 직후 첫번째 아이템의 버튼에 이벤트 리스너 연결
  setTimeout(() => {
    attachEventListenersToButtons();
  }, 500);

  // 메인 상세 정보 관찰
  if (targetNode) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          attachEventListenersToButtons();
        }
      });
    });

    // 옵저버 설정 및 시작
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  }

  // 모바일용 상세 정보 관찰
  if (hoverDetailNode) {
    const hoverObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          attachEventListenersToButtons();
        }
      });
    });

    // 옵저버 설정 및 시작
    const config = { childList: true, subtree: true };
    hoverObserver.observe(hoverDetailNode, config);
  }
}

// 수정/삭제 버튼에 이벤트 리스너 연결하는 함수 (재사용성을 위해 분리)
function attachEventListenersToButtons() {
  // 모든 .closet__detail 요소에서 버튼 찾기
  const allDetailNodes = document.querySelectorAll(".closet__detail");

  allDetailNodes.forEach((detailNode) => {
    // 삭제 버튼에 이벤트 리스너 연결
    const deleteButton = detailNode.querySelector(
      ".button-group button:nth-child(2)"
    );
    if (deleteButton) {
      deleteButton.removeEventListener("click", handleDeleteClick);
      deleteButton.addEventListener("click", handleDeleteClick);
    }

    // 수정 버튼에 이벤트 리스너 연결
    const editButton = detailNode.querySelector(
      ".button-group button:nth-child(1)"
    );
    if (editButton) {
      editButton.removeEventListener("click", handleEditClick);
      editButton.addEventListener("click", handleEditClick);
    }
  });
}

// 수정 버튼 클릭 처리
function handleEditClick(event) {
  // 클릭된 버튼의 상위 detail 요소 찾기
  const detailEl = event.target.closest(".closet__detail");

  if (!detailEl) {
    alert("수정할 아이템을 찾을 수 없습니다.");
    return;
  }

  const itemId = detailEl.dataset.itemId;

  if (!itemId) {
    alert("수정할 아이템을 찾을 수 없습니다.");
    return;
  }

  // add.html 페이지로 이동하면서 수정할 아이템 ID를 쿼리 파라미터로 전달
  window.location.href = `/add.html?mode=edit&id=${itemId}`;
}

// 삭제 버튼 클릭 처리
function handleDeleteClick(event) {
  // 클릭된 버튼의 상위 detail 요소 찾기
  const detailEl = event.target.closest(".closet__detail");

  if (!detailEl) {
    alert("삭제할 아이템을 찾을 수 없습니다.");
    return;
  }

  const itemId = detailEl.dataset.itemId;

  if (!itemId) {
    alert("삭제할 아이템을 찾을 수 없습니다.");
    return;
  }

  // 사용자에게 삭제 확인
  if (confirm("정말 이 아이템을 삭제하시겠습니까?")) {
    deleteItem(itemId);
  }
}

// 아이템 삭제 처리
function deleteItem(itemId) {
  try {
    // localStorage에서 현재 데이터 가져오기
    let closetData = JSON.parse(localStorage.getItem("closet")) || [];

    // 삭제할 아이템의 인덱스 찾기
    const itemIndex = closetData.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      alert("삭제할 아이템을 찾을 수 없습니다.");
      return;
    }

    closetData.splice(itemIndex, 1);

    localStorage.setItem("closet", JSON.stringify(closetData));

    alert("아이템이 삭제되었습니다.");

    window.location.reload();
  } catch (error) {
    console.error("아이템 삭제 중 오류 발생:", error);
    alert("삭제 처리 중 오류가 발생했습니다.");
  }
}
