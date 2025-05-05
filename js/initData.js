export function initializeClosetData() {
  // 이미 데이터가 있으면 바로 종료
  if (
    localStorage.getItem("closet") &&
    JSON.parse(localStorage.getItem("closet")).length > 0
  ) {
    return Promise.resolve();
  }

  // 데이터 파일 로드
  return fetch("./data/data.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("데이터 파일을 찾을 수 없습니다.");
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("closet", JSON.stringify(data));
    })
    .catch((err) => {
      console.error("데이터 초기화 중 오류 발생:", err);
      // 오류 발생 시 빈 배열 초기화
      localStorage.setItem("closet", JSON.stringify([]));
    });
}
