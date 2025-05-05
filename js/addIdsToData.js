export function addIdsToExistingData() {
  // localStorage에서 기존 데이터 가져오기
  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  // 각 아이템에 ID 추가
  const updatedData = closetData.map((item) => {
    if (!item.id) {
      return {
        id: crypto.randomUUID(), // 고유 ID 생성
        ...item,
      };
    }
    return item;
  });

  localStorage.setItem("closet", JSON.stringify(updatedData));

  return updatedData;
}
