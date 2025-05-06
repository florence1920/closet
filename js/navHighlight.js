export function navHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  const baseHref = document.querySelector("base")?.getAttribute("href");

  const repoNameMatch = baseHref ? baseHref.match(/\/([^\/]+)\/$/) : null;
  const repoName = repoNameMatch ? `/${repoNameMatch[1]}` : "";

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

    if (isMatch) {
      setTimeout(() => {
        link.classList.add("active");
      }, 300);
    } else {
      link.classList.remove("active");
    }

    link.addEventListener("click", handleNavClick);
  });
}

function handleNavClick(e) {
  document.querySelectorAll("nav a").forEach((item) => {
    item.classList.remove("active");
  });

  this.classList.add("active");
}
