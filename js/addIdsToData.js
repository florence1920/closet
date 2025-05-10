export function addIdsToExistingData() {
  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

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
