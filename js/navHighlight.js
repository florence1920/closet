export function navHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  const baseHref = document.querySelector("base")?.getAttribute("href") || "";
  const basePath = baseHref ? new URL(baseHref, window.location.origin).pathname : "";

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  navLinks.forEach((link) => {
    link.removeEventListener("click", handleNavClick);

    const linkHref = link.getAttribute("href");

    const normalizedLinkPath = linkHref.replace('./', '');
    const normalizedCurrentPath = currentPath.replace(basePath, '').replace(/^\//, '');

    const isMatch = 
      normalizedCurrentPath === normalizedLinkPath ||
      (normalizedCurrentPath === '' && normalizedLinkPath === 'index.html') ||
      (normalizedCurrentPath === '/' && normalizedLinkPath === 'index.html');

    if (isMatch) {
      link.classList.add("active");
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
