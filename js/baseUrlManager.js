//배포 환경(GitHub Pages)과 로컬 환경을 감지

export function setupBaseUrl() {
  const isGitHubPages = window.location.hostname.includes("github.io");
  const existingBaseTag = document.querySelector("base");

  if (isGitHubPages) {
    // 배포 환경일 경우 base 태그 설정
    if (existingBaseTag) {
      existingBaseTag.href = "https://florence1920.github.io/closet/";
    } else {
      const baseTag = document.createElement("base");
      baseTag.href = "https://florence1920.github.io/closet/";
      document.head.prepend(baseTag);
    }
  } else {
    // 로컬 환경일 경우 base 태그 제거
    if (existingBaseTag) {
      existingBaseTag.remove();
    }
  }
}

export function getCorrectPath(path) {
  const isGitHubPages = window.location.hostname.includes("github.io");

  if (isGitHubPages) {
    if (path.startsWith("/closet/")) {
      return path;
    }

    if (path.startsWith("./")) {
      return `/closet/${path.substring(2)}`;
    } else {
      return `/closet/${path}`;
    }
  } else {
    return path;
  }
}

export function fixAllLinks() {
  const isGitHubPages = window.location.hostname.includes("github.io");

  if (isGitHubPages) {
    document
      .querySelectorAll(
        'a[href^="./"], a[href^="add.html"], a[href^="index.html"], a[href^="stat.html"]'
      )
      .forEach((link) => {
        const href = link.getAttribute("href");

        if (href.startsWith("/closet/")) return;

        if (href.startsWith("./")) {
          link.setAttribute("href", `/closet/${href.substring(2)}`);
        } else {
          link.setAttribute("href", `/closet/${href}`);
        }
      });
  }
}
