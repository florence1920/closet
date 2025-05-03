// 통계 페이지 차트 생성 및 데이터 처리

// 문서 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 데이터 가져오기
  const closetData = JSON.parse(localStorage.getItem("closet")) || [];

  if (closetData.length === 0) {
    showNoDataMessage();
    return;
  }

  // 차트 초기화
  initializeCharts(closetData);
});

// 데이터가 없을 때 메시지 표시
function showNoDataMessage() {
  const containers = document.querySelectorAll(".chart-container");
  containers.forEach((container) => {
    container.innerHTML =
      '<p class="no-data-message">데이터가 없습니다. 먼저 옷을 등록해주세요.</p>';
  });
}

// 모든 차트 초기화
function initializeCharts(data) {
  createColorChart(data);
  createCategoryChart(data);
  createBrandChart(data);
}

// 카테고리별 분포 차트
function createCategoryChart(data) {
  // 메인 카테고리별 데이터 집계
  const mainCategories = {};

  data.forEach((item) => {
    const mainCategory = item.category?.main || "기타";
    mainCategories[mainCategory] = (mainCategories[mainCategory] || 0) + 1;
  });

  // 차트 데이터 준비
  const labels = Object.keys(mainCategories);
  const counts = Object.values(mainCategories);

  // 차트 생성
  const ctx = document.getElementById("categoryChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "개수",
          data: counts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      layout: {
        padding: 0,
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

// 색상별 분포 차트
function createColorChart(data) {
  // 색상별 데이터 집계
  const colors = {};

  data.forEach((item) => {
    const color = item.color || "기타";
    colors[color] = (colors[color] || 0) + 1;
  });

  // 데이터 정렬 (모든 색상 표시)
  const sortedColors = Object.entries(colors).sort((a, b) => b[1] - a[1]);

  const labels = sortedColors.map((entry) => entry[0]);
  const counts = sortedColors.map((entry) => entry[1]);

  // 실제 색상값 매핑
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#AAAAAA",
    charcoal: "#36454F",
    beige: "#F5F5DC",
    brown: "#964B00",
    navy: "#000080",
    blue: "#0000FF",
    "light-blue": "#ADD8E6",
    red: "#FF0000",
    yellow: "#FFFF00",
    green: "#008000",
    khaki: "#C3B091",
  };

  // 배경색 생성
  const backgroundColor = labels.map((color) => {
    return colorMap[color] ? `${colorMap[color]}CC` : "#777777CC";
  });

  // 테두리 색상 생성
  const borderColor = labels.map((color) => {
    // 흰색일 경우 검은색 테두리, 그 외에는 배경색과 동일하게
    return color === "white" ? "#000000" : colorMap[color] || "#777777";
  });

  // 차트 생성
  const ctx = document.getElementById("colorChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "개수",
          data: counts,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

// 브랜드별 분포 차트
function createBrandChart(data) {
  // 브랜드별 데이터 집계
  const brands = {};

  data.forEach((item) => {
    const brand = item.brand || "미지정";
    if (brand === "-") return; // 미지정 브랜드 제외

    brands[brand] = (brands[brand] || 0) + 1;
  });

  // 데이터 정렬 (상위 8개만 표시)
  const sortedBrands = Object.entries(brands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const labels = sortedBrands.map((entry) => entry[0]);
  const counts = sortedBrands.map((entry) => entry[1]);

  // 차트 생성
  const ctx = document.getElementById("brandChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "개수",
          data: counts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(199, 199, 199, 0.7)",
            "rgba(83, 102, 255, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}
