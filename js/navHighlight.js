export function navHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  const baseHref = document.querySelector("base")?.getAttribute("href");

  const repoNameMatch = baseHref ? baseHref.match(/\/([^\/]+)\/$/) : null;
  const repoName = repoNameMatch ? `/${repoNameMatch[1]}` : "";

  // 로컬 스토리지에서 현재 활성화된 메뉴 확인
  const activeMenu = localStorage.getItem("activeMenu");

  navLinks.forEach((link) => {
    link.removeEventListener("click", handleNavClick);

    const linkHref = link.getAttribute("href");

    const isMatch =
      linkHref === currentPath ||
      (baseHref && currentPath.endsWith(linkHref.replace("./", ""))) ||
      (repoName &&
        currentPath === `${repoName}/${linkHref.replace("./", "")}`) ||
      ((currentPath === "/" ||
        currentPath === repoName ||
        currentPath === `${repoName}/`) &&
        (linkHref === "./index.html" || linkHref === "index.html"));

    // 현재 페이지와 일치하거나 로컬 스토리지에 저장된 active 메뉴와 일치하면 active 클래스 추가
    if (isMatch || linkHref === activeMenu) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
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

  // 클릭한 링크 href를 로컬 스토리지에 저장
  localStorage.setItem("activeMenu", this.getAttribute("href"));
}
