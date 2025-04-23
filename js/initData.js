export function initializeClosetData() {
  if (localStorage.getItem("closet")) return;

  fetch("../data/data.json")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("closet", JSON.stringify(data));
    })
    .catch((err) => {
      console.error("데이터 초기화 중 오류 발생:", err);
    });
}
