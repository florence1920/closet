export function navHighlight() {
  // 현재 경로 가져오기
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  // GitHub Pages나 다른 서브 디렉토리 배포를 위한 baseHref 처리
  const baseHref = document.querySelector("base")?.getAttribute("href") || "";
  const basePath = baseHref ? new URL(baseHref, window.location.origin).pathname : "";

  // 모든 링크에서 active 클래스 제거
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  navLinks.forEach((link) => {
    link.removeEventListener("click", handleNavClick);

    const linkHref = link.getAttribute("href");

    // 링크 경로 정규화
    const normalizedLinkPath = linkHref.replace('./', '');
    const normalizedCurrentPath = currentPath.replace(basePath, '').replace(/^\//, '');

    // 경로 매칭 검사
    const isMatch = 
      normalizedCurrentPath === normalizedLinkPath ||
      (normalizedCurrentPath === '' && normalizedLinkPath === 'index.html') ||
      (normalizedCurrentPath === '/' && normalizedLinkPath === 'index.html');

    // 현재 페이지와 일치하는 경우에만 active 클래스 추가
    if (isMatch) {
      link.classList.add("active");
    }

    link.addEventListener("click", handleNavClick);
  });
}

function handleNavClick(e) {
  // 기존 active 클래스 모두 제거
  document.querySelectorAll("nav a").forEach((item) => {
    item.classList.remove("active");
  });

  // 클릭한 링크에 active 클래스 추가
  this.classList.add("active");
}
