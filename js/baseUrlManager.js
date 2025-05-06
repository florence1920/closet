//배포 환경(GitHub Pages)과 로컬 환경을 자동으로 감지하여 base 태그를 설정하는 모듈

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
  // 현재 hostname이 github.io를 포함하는지 확인 (배포 환경 감지)
  const isGitHubPages = window.location.hostname.includes("github.io");

  if (isGitHubPages) {
    return path.startsWith("./")
      ? `/closet/${path.substring(2)}`
      : `/closet/${path}`;
  } else {
    return path;
  }
}

//페이지 내의 모든 링크(a 태그)의 href 속성을 환경에 맞게 수정

export function fixAllLinks() {
  const isGitHubPages = window.location.hostname.includes("github.io");

  if (isGitHubPages) {
    // 배포 환경일 경우에만 링크 수정
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
