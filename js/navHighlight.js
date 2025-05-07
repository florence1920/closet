export function navHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  const baseHref = document.querySelector("base")?.getAttribute("href");

  const repoNameMatch = baseHref ? baseHref.match(/\/([^\/]+)\/$/) : null;
  const repoName = repoNameMatch ? `/${repoNameMatch[1]}` : "";

  // 모든 링크에서 active 클래스 제거
  navLinks.forEach((link) => link.classList.remove("active"));

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
