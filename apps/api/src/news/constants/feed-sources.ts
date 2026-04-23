// apps/api/src/news/constants/feed-sources.ts
// RSS 피드 소스 목록 — 뉴스 자동 수집 파이프라인에서 사용

// 피드 소스 타입 정의
// platform 필드가 있으면 Console 파이프라인(영문 → 한국어 재작성)으로 처리
export interface FeedSource {
  name: string;
  url: string;
  language: "ko" | "en";
  platform?: string; // Console 소스인 경우 플랫폼명 (PlayStation / Xbox / Nintendo)
}

// 실제 수집 대상 RSS 피드 목록
export const FEED_SOURCES: FeedSource[] = [
  // PC/Mobile 플랫폼 소스 — 대부분 한국어 RSS, platform 필드 없음 → 기본 파이프라인으로 처리
  { name: "게임메카", url: "https://www.gamemeca.com/rss.php", language: "ko" },
  // Console 플랫폼 소스 — 영문 RSS, platform 필드로 Console 파이프라인 분기
  {
    name: "Push Square",
    url: "https://www.pushsquare.com/feeds/latest",
    language: "en",
    platform: "PlayStation",
  },
  {
    name: "Pure Xbox",
    url: "https://www.purexbox.com/feeds/latest",
    language: "en",
    platform: "Xbox",
  },
  {
    name: "Nintendo Life",
    url: "https://www.nintendolife.com/feeds/latest",
    language: "en",
    platform: "Nintendo",
  },
];
