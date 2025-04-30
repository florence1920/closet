// 기존 데이터에 ID를 추가하는 임시 스크립트
// 개발자 도구 콘솔에서 실행하거나 index.js에서 한 번만 실행한 후 제거

export function addIdsToExistingData() {
  console.log("기존 데이터에 ID 추가 중...");

  // localStorage에서 기존 데이터 가져오기
  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  // 각 아이템에 ID 추가
  const updatedData = closetData.map((item) => {
    // 이미 ID가 있는 경우는 유지, 없는 경우만 추가
    if (!item.id) {
      return {
        id: crypto.randomUUID(), // 고유 ID 생성
        ...item,
      };
    }
    return item;
  });

  // 업데이트된 데이터 저장
  localStorage.setItem("closet", JSON.stringify(updatedData));

  console.log(`ID 추가 완료: 총 ${updatedData.length}개 아이템 업데이트됨`);
  return updatedData;
}
