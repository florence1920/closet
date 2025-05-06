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
    // 이미 /closet/으로 시작하는 경로는 그대로 반환
    if (path.startsWith("/closet/")) {
      return path;
    }

    // 상대 경로('./xxx.html')나 단순 파일명('xxx.html')을 올바른 GitHub Pages 경로로 변환
    if (path.startsWith("./")) {
      return `/closet/${path.substring(2)}`;
    } else {
      return `/closet/${path}`;
    }
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

        // 이미 /closet/로 시작하는 링크는 건너뛰기
        if (href.startsWith("/closet/")) return;

        // 상대 경로를 GitHub Pages 형식으로 변환
        if (href.startsWith("./")) {
          link.setAttribute("href", `/closet/${href.substring(2)}`);
        } else {
          link.setAttribute("href", `/closet/${href}`);
        }
      });
  }
}
