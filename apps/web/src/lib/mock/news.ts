// Mock 데이터 — 뉴스 메인페이지 UI 구현용 (API 연동 전 임시 데이터)
// 실제 API 연동 시 이 파일을 삭제하고 apiClient 호출로 교체

// 대분류 카테고리 슬러그 타입
export type CategorySlug = 'all' | 'pc' | 'console' | 'mobile' | 'esports'

// 소분류 슬러그 타입 — 대분류별 게임/리그
export type PCSubSlug =
  | 'lol'
  | 'valorant'
  | 'overwatch'
  | 'pubg'
  | 'lostark'
  | 'maple'
  | 'dnf'
  | 'pc-etc'
export type MobileSubSlug =
  | 'genshin'
  | 'pubgm'
  | 'lineagem'
  | 'cookierun'
  | 'solo-leveling'
  | 'mobile-etc'
export type ConsoleSubSlug = 'eldenring' | 'ff' | 'gta' | 'zelda' | 'console-etc'
export type EsportsSubSlug = 'lck' | 'vct' | 'owl' | 'esports-etc'
export type SubCategorySlug = PCSubSlug | MobileSubSlug | ConsoleSubSlug | EsportsSubSlug

// 대분류 카테고리 타입
export interface Category {
  id: number
  name: string
  slug: string
}

// 소분류 카테고리 타입
export interface SubCategory {
  id: number
  name: string
  slug: SubCategorySlug
}

// 사이드카드 뉴스 타입
export interface SideNews {
  id: number
  slug: string
  title: string
  thumbnail: string
  category: Category
  subCategory?: SubCategory
  viewCount: number
  readTime: number
  publishedAt: string
}

// Hero 메인 뉴스 타입 (summary 포함)
export interface HeroNews extends SideNews {
  summary: string
}

// 최신 뉴스 타입
export interface LatestNews {
  id: number
  slug: string
  title: string
  thumbnail: string
  category: Category
  subCategory?: SubCategory
  viewCount: number
  readTime: number
  publishedAt: string
}

// 커뮤니티 HOT 타입
export interface CommunityHot {
  id: number
  title: string
  viewCount: number
  slug: string
}

// Hero 섹션 카테고리별 데이터 타입
export interface HeroCategoryData {
  top1: HeroNews
  sides: SideNews[]
}

// 대분류 카테고리 목록
export const mockCategories: Category[] = [
  { id: 0, name: '전체', slug: 'all' },
  { id: 1, name: 'PC', slug: 'pc' },
  { id: 2, name: '콘솔', slug: 'console' },
  { id: 3, name: '모바일', slug: 'mobile' },
  { id: 4, name: 'Esports', slug: 'esports' },
]

// 소분류 카테고리 목록 — 대분류별
export const mockSubCategories: Record<Exclude<CategorySlug, 'all'>, SubCategory[]> = {
  pc: [
    { id: 11, name: '리그오브레전드', slug: 'lol' },
    { id: 12, name: '발로란트', slug: 'valorant' },
    { id: 13, name: '오버워치', slug: 'overwatch' },
    { id: 14, name: '배틀그라운드', slug: 'pubg' },
    { id: 15, name: '로스트아크', slug: 'lostark' },
    { id: 16, name: '메이플스토리', slug: 'maple' },
    { id: 17, name: '던전앤파이터', slug: 'dnf' },
    { id: 18, name: '기타 PC', slug: 'pc-etc' },
  ],
  mobile: [
    { id: 21, name: '원신', slug: 'genshin' },
    { id: 22, name: '배틀그라운드 모바일', slug: 'pubgm' },
    { id: 23, name: '리니지M', slug: 'lineagem' },
    { id: 24, name: '쿠키런', slug: 'cookierun' },
    { id: 25, name: '나혼자만레벨업', slug: 'solo-leveling' },
    { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
  ],
  console: [
    { id: 31, name: '엘든링', slug: 'eldenring' },
    { id: 32, name: '파이널판타지', slug: 'ff' },
    { id: 33, name: 'GTA', slug: 'gta' },
    { id: 34, name: '젤다', slug: 'zelda' },
    { id: 35, name: '기타 콘솔', slug: 'console-etc' },
  ],
  esports: [
    { id: 41, name: 'LCK', slug: 'lck' },
    { id: 42, name: 'VCT', slug: 'vct' },
    { id: 43, name: '오버워치 리그', slug: 'owl' },
    { id: 44, name: '기타 Esports', slug: 'esports-etc' },
  ],
}

// 카테고리별 Top4 뉴스 (7일간 조회수 기준)
export const mockHeroNewsByCategory: Record<CategorySlug, HeroCategoryData> = {
  all: {
    top1: {
      id: 1,
      slug: 't1-lck-final',
      title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
      summary:
        'T1이 LCK 스프링 4강에서 KT를 3:1로 꺾고 결승에 올랐다. 페이커가 세트 MVP를 3번 수상했다.',
      thumbnail: 'https://picsum.photos/seed/all1/1200/600',
      category: { id: 4, name: 'Esports', slug: 'esports' },
      subCategory: { id: 41, name: 'LCK', slug: 'lck' },
      viewCount: 49000,
      readTime: 3,
      publishedAt: '2026-04-10T00:00:00.000Z',
    },
    sides: [
      {
        id: 11,
        slug: 'valorant-tier',
        title: '발로란트 현 시즌 최강 조합 공개 — 레디언트 달성 꿀팁',
        thumbnail: 'https://picsum.photos/seed/pc1/400/300',
        category: { id: 1, name: 'PC', slug: 'pc' },
        subCategory: { id: 12, name: '발로란트', slug: 'valorant' },
        viewCount: 39000,
        readTime: 3,
        publishedAt: '2026-04-09T00:00:00.000Z',
      },
      {
        id: 21,
        slug: 'switch2-reveal',
        title: '닌텐도 스위치 2 공개 — 출시일·가격·라인업 총정리',
        thumbnail: 'https://picsum.photos/seed/con1/400/300',
        category: { id: 2, name: '콘솔', slug: 'console' },
        subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
        viewCount: 42000,
        readTime: 5,
        publishedAt: '2026-04-08T00:00:00.000Z',
      },
      {
        id: 31,
        slug: 'brawlstars-update',
        title: '브롤스타즈 시즌 업데이트 — 신규 브롤러 3종 동시 공개',
        thumbnail: 'https://picsum.photos/seed/mob1/400/300',
        category: { id: 3, name: '모바일', slug: 'mobile' },
        subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
        viewCount: 28000,
        readTime: 2,
        publishedAt: '2026-04-07T00:00:00.000Z',
      },
      {
        id: 1,
        slug: 't1-lck-final',
        title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
        thumbnail: 'https://picsum.photos/seed/all1/400/300',
        category: { id: 4, name: 'Esports', slug: 'esports' },
        subCategory: { id: 41, name: 'LCK', slug: 'lck' },
        viewCount: 49000,
        readTime: 3,
        publishedAt: '2026-04-10T00:00:00.000Z',
      },
    ],
  },
  pc: {
    top1: {
      id: 11,
      slug: 'valorant-tier',
      title: '발로란트 현 시즌 최강 조합 공개 — 레디언트 달성 꿀팁',
      summary: '현 시즌 레디언트 달성률 1위 조합이 공개됐다. 챔버+세이지 조합이 핵심.',
      thumbnail: 'https://picsum.photos/seed/pc1/1200/600',
      category: { id: 1, name: 'PC', slug: 'pc' },
      subCategory: { id: 12, name: '발로란트', slug: 'valorant' },
      viewCount: 39000,
      readTime: 3,
      publishedAt: '2026-04-09T00:00:00.000Z',
    },
    sides: [
      {
        id: 12,
        slug: 'lol-champion',
        title: '리그오브레전드 신규 챔피언 공개 — 역대급 스킬셋 예고',
        thumbnail: 'https://picsum.photos/seed/pc2/400/300',
        category: { id: 1, name: 'PC', slug: 'pc' },
        subCategory: { id: 11, name: '리그오브레전드', slug: 'lol' },
        viewCount: 35000,
        readTime: 4,
        publishedAt: '2026-04-08T00:00:00.000Z',
      },
      {
        id: 13,
        slug: 'overwatch2-season',
        title: '오버워치2 시즌 10 — 신규 영웅 베네사 공식 합류',
        thumbnail: 'https://picsum.photos/seed/pc3/400/300',
        category: { id: 1, name: 'PC', slug: 'pc' },
        subCategory: { id: 13, name: '오버워치', slug: 'overwatch' },
        viewCount: 21000,
        readTime: 3,
        publishedAt: '2026-04-07T00:00:00.000Z',
      },
      {
        id: 14,
        slug: 'starcraft-tournament',
        title: '스타크래프트2 GSL 결승 — 역대 최고 시청자 기록',
        thumbnail: 'https://picsum.photos/seed/pc4/400/300',
        category: { id: 1, name: 'PC', slug: 'pc' },
        subCategory: { id: 18, name: '기타 PC', slug: 'pc-etc' },
        viewCount: 18000,
        readTime: 2,
        publishedAt: '2026-04-06T00:00:00.000Z',
      },
    ],
  },
  console: {
    top1: {
      id: 21,
      slug: 'switch2-reveal',
      title: '닌텐도 스위치 2 드디어 공개 — 출시일·가격·게임 라인업 총정리',
      summary: '닌텐도가 스위치 2를 공식 발표했다. 6월 출시, 449달러. 마리오 카트 신작 동시 출시.',
      thumbnail: 'https://picsum.photos/seed/con1/1200/600',
      category: { id: 2, name: '콘솔', slug: 'console' },
      subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
      viewCount: 42000,
      readTime: 5,
      publishedAt: '2026-04-08T00:00:00.000Z',
    },
    sides: [
      {
        id: 22,
        slug: 'ps5-pro-specs',
        title: 'PS5 Pro 스펙 유출 — GPU 성능 2배, 4K 120fps 지원',
        thumbnail: 'https://picsum.photos/seed/con2/400/300',
        category: { id: 2, name: '콘솔', slug: 'console' },
        subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
        viewCount: 33000,
        readTime: 3,
        publishedAt: '2026-04-07T00:00:00.000Z',
      },
      {
        id: 23,
        slug: 'xbox-gamepass',
        title: '엑스박스 게임패스 4월 신규 타이틀 20개 공개',
        thumbnail: 'https://picsum.photos/seed/con3/400/300',
        category: { id: 2, name: '콘솔', slug: 'console' },
        subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
        viewCount: 19000,
        readTime: 2,
        publishedAt: '2026-04-06T00:00:00.000Z',
      },
      {
        id: 24,
        slug: 'sony-vr2',
        title: '소니 PS VR2 신형 출시 임박 — 가격·스펙 공개',
        thumbnail: 'https://picsum.photos/seed/con4/400/300',
        category: { id: 2, name: '콘솔', slug: 'console' },
        subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
        viewCount: 15000,
        readTime: 4,
        publishedAt: '2026-04-05T00:00:00.000Z',
      },
    ],
  },
  mobile: {
    top1: {
      id: 31,
      slug: 'brawlstars-update',
      title: '브롤스타즈 시즌 업데이트 — 신규 브롤러 3종 동시 공개',
      summary: '수퍼셀이 브롤스타즈 최대 업데이트를 공개했다. 신규 브롤러 3종과 새 게임 모드 추가.',
      thumbnail: 'https://picsum.photos/seed/mob1/1200/600',
      category: { id: 3, name: '모바일', slug: 'mobile' },
      subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
      viewCount: 28000,
      readTime: 2,
      publishedAt: '2026-04-07T00:00:00.000Z',
    },
    sides: [
      {
        id: 32,
        slug: 'genshin-natlan',
        title: '원신 5.0 나타 지역 전체 맵 첫 공개',
        thumbnail: 'https://picsum.photos/seed/mob2/400/300',
        category: { id: 3, name: '모바일', slug: 'mobile' },
        subCategory: { id: 21, name: '원신', slug: 'genshin' },
        viewCount: 25000,
        readTime: 5,
        publishedAt: '2026-04-06T00:00:00.000Z',
      },
      {
        id: 33,
        slug: 'pubgmobile-update',
        title: '배그모바일 역대급 업데이트 — 새 맵·무기 추가',
        thumbnail: 'https://picsum.photos/seed/mob3/400/300',
        category: { id: 3, name: '모바일', slug: 'mobile' },
        subCategory: { id: 22, name: '배틀그라운드 모바일', slug: 'pubgm' },
        viewCount: 22000,
        readTime: 3,
        publishedAt: '2026-04-05T00:00:00.000Z',
      },
      {
        id: 34,
        slug: 'honkai-starrail',
        title: '붕괴: 스타레일 신규 캐릭터 공개 — 출시 일정 확정',
        thumbnail: 'https://picsum.photos/seed/mob4/400/300',
        category: { id: 3, name: '모바일', slug: 'mobile' },
        subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
        viewCount: 18000,
        readTime: 2,
        publishedAt: '2026-04-04T00:00:00.000Z',
      },
    ],
  },
  esports: {
    top1: {
      id: 1,
      slug: 't1-lck-final',
      title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
      summary: 'T1이 LCK 스프링 4강에서 KT를 3:1로 꺾고 결승에 올랐다.',
      thumbnail: 'https://picsum.photos/seed/all1/1200/600',
      category: { id: 4, name: 'Esports', slug: 'esports' },
      subCategory: { id: 41, name: 'LCK', slug: 'lck' },
      viewCount: 49000,
      readTime: 3,
      publishedAt: '2026-04-10T00:00:00.000Z',
    },
    sides: [
      {
        id: 42,
        slug: 'worlds-schedule',
        title: '2026 LoL 월드챔피언십 일정 공개 — 한국 개최 확정',
        thumbnail: 'https://picsum.photos/seed/es2/400/300',
        category: { id: 4, name: 'Esports', slug: 'esports' },
        subCategory: { id: 41, name: 'LCK', slug: 'lck' },
        viewCount: 37000,
        readTime: 4,
        publishedAt: '2026-04-09T00:00:00.000Z',
      },
      {
        id: 43,
        slug: 'valorant-masters',
        title: 'VCT 마스터즈 도쿄 — 한국팀 4강 전원 진출',
        thumbnail: 'https://picsum.photos/seed/es3/400/300',
        category: { id: 4, name: 'Esports', slug: 'esports' },
        subCategory: { id: 42, name: 'VCT', slug: 'vct' },
        viewCount: 29000,
        readTime: 3,
        publishedAt: '2026-04-08T00:00:00.000Z',
      },
      {
        id: 44,
        slug: 'gsc-final',
        title: 'GSC 결승전 — 역대 최고 시청자 200만 돌파',
        thumbnail: 'https://picsum.photos/seed/es4/400/300',
        category: { id: 4, name: 'Esports', slug: 'esports' },
        subCategory: { id: 44, name: '기타 Esports', slug: 'esports-etc' },
        viewCount: 21000,
        readTime: 2,
        publishedAt: '2026-04-07T00:00:00.000Z',
      },
    ],
  },
}

// 최신 뉴스 (발행순, 20개 — 카테고리 필터에 사용)
export const mockLatestNews: LatestNews[] = [
  // PC 5개
  {
    id: 11,
    slug: 'valorant-tier',
    title: '발로란트 현 시즌 최강 조합 공개 — 레디언트 달성 꿀팁',
    thumbnail: 'https://picsum.photos/seed/pc1/400/225',
    category: { id: 1, name: 'PC', slug: 'pc' },
    subCategory: { id: 12, name: '발로란트', slug: 'valorant' },
    viewCount: 39000,
    readTime: 3,
    publishedAt: '2026-04-09T00:00:00.000Z',
  },
  {
    id: 12,
    slug: 'lol-champion',
    title: '리그오브레전드 신규 챔피언 공개 — 역대급 스킬셋 예고',
    thumbnail: 'https://picsum.photos/seed/pc2/400/225',
    category: { id: 1, name: 'PC', slug: 'pc' },
    subCategory: { id: 11, name: '리그오브레전드', slug: 'lol' },
    viewCount: 35000,
    readTime: 4,
    publishedAt: '2026-04-08T00:00:00.000Z',
  },
  {
    id: 13,
    slug: 'overwatch2-season',
    title: '오버워치2 시즌 10 — 신규 영웅 베네사 공식 합류',
    thumbnail: 'https://picsum.photos/seed/pc3/400/225',
    category: { id: 1, name: 'PC', slug: 'pc' },
    subCategory: { id: 13, name: '오버워치', slug: 'overwatch' },
    viewCount: 21000,
    readTime: 3,
    publishedAt: '2026-04-07T00:00:00.000Z',
  },
  {
    id: 14,
    slug: 'starcraft-tournament',
    title: '스타크래프트2 GSL 결승 — 역대 최고 시청자 기록',
    thumbnail: 'https://picsum.photos/seed/pc4/400/225',
    category: { id: 1, name: 'PC', slug: 'pc' },
    subCategory: { id: 18, name: '기타 PC', slug: 'pc-etc' },
    viewCount: 18000,
    readTime: 2,
    publishedAt: '2026-04-06T00:00:00.000Z',
  },
  {
    id: 15,
    slug: 'diablo4-season',
    title: '디아블로4 시즌 4 공식 발표 — 새 클래스 공개',
    thumbnail: 'https://picsum.photos/seed/pc5/400/225',
    category: { id: 1, name: 'PC', slug: 'pc' },
    subCategory: { id: 18, name: '기타 PC', slug: 'pc-etc' },
    viewCount: 14000,
    readTime: 3,
    publishedAt: '2026-04-05T00:00:00.000Z',
  },
  // 콘솔 5개
  {
    id: 21,
    slug: 'switch2-reveal',
    title: '닌텐도 스위치 2 드디어 공개 — 출시일·가격·게임 라인업 총정리',
    thumbnail: 'https://picsum.photos/seed/con1/400/225',
    category: { id: 2, name: '콘솔', slug: 'console' },
    subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
    viewCount: 42000,
    readTime: 5,
    publishedAt: '2026-04-08T00:00:00.000Z',
  },
  {
    id: 22,
    slug: 'ps5-pro-specs',
    title: 'PS5 Pro 스펙 유출 — GPU 성능 2배, 4K 120fps 지원',
    thumbnail: 'https://picsum.photos/seed/con2/400/225',
    category: { id: 2, name: '콘솔', slug: 'console' },
    subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
    viewCount: 33000,
    readTime: 3,
    publishedAt: '2026-04-07T00:00:00.000Z',
  },
  {
    id: 23,
    slug: 'xbox-gamepass',
    title: '엑스박스 게임패스 4월 신규 타이틀 20개 공개',
    thumbnail: 'https://picsum.photos/seed/con3/400/225',
    category: { id: 2, name: '콘솔', slug: 'console' },
    subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
    viewCount: 19000,
    readTime: 2,
    publishedAt: '2026-04-06T00:00:00.000Z',
  },
  {
    id: 24,
    slug: 'sony-vr2',
    title: '소니 PS VR2 신형 출시 임박 — 가격·스펙 공개',
    thumbnail: 'https://picsum.photos/seed/con4/400/225',
    category: { id: 2, name: '콘솔', slug: 'console' },
    subCategory: { id: 35, name: '기타 콘솔', slug: 'console-etc' },
    viewCount: 15000,
    readTime: 4,
    publishedAt: '2026-04-05T00:00:00.000Z',
  },
  {
    id: 25,
    slug: 'zelda-totk-dlc',
    title: '젤다의 전설 왕국의 눈물 DLC 공식 발표',
    thumbnail: 'https://picsum.photos/seed/con5/400/225',
    category: { id: 2, name: '콘솔', slug: 'console' },
    subCategory: { id: 34, name: '젤다', slug: 'zelda' },
    viewCount: 12000,
    readTime: 3,
    publishedAt: '2026-04-04T00:00:00.000Z',
  },
  // 모바일 5개
  {
    id: 31,
    slug: 'brawlstars-update',
    title: '브롤스타즈 시즌 업데이트 — 신규 브롤러 3종 동시 공개',
    thumbnail: 'https://picsum.photos/seed/mob1/400/225',
    category: { id: 3, name: '모바일', slug: 'mobile' },
    subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
    viewCount: 28000,
    readTime: 2,
    publishedAt: '2026-04-07T00:00:00.000Z',
  },
  {
    id: 32,
    slug: 'genshin-natlan',
    title: '원신 5.0 나타 지역 전체 맵 첫 공개',
    thumbnail: 'https://picsum.photos/seed/mob2/400/225',
    category: { id: 3, name: '모바일', slug: 'mobile' },
    subCategory: { id: 21, name: '원신', slug: 'genshin' },
    viewCount: 25000,
    readTime: 5,
    publishedAt: '2026-04-06T00:00:00.000Z',
  },
  {
    id: 33,
    slug: 'pubgmobile-update',
    title: '배그모바일 역대급 업데이트 — 새 맵·무기 추가',
    thumbnail: 'https://picsum.photos/seed/mob3/400/225',
    category: { id: 3, name: '모바일', slug: 'mobile' },
    subCategory: { id: 22, name: '배틀그라운드 모바일', slug: 'pubgm' },
    viewCount: 22000,
    readTime: 3,
    publishedAt: '2026-04-05T00:00:00.000Z',
  },
  {
    id: 34,
    slug: 'honkai-starrail',
    title: '붕괴: 스타레일 신규 캐릭터 공개 — 출시 일정 확정',
    thumbnail: 'https://picsum.photos/seed/mob4/400/225',
    category: { id: 3, name: '모바일', slug: 'mobile' },
    subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
    viewCount: 18000,
    readTime: 2,
    publishedAt: '2026-04-04T00:00:00.000Z',
  },
  {
    id: 35,
    slug: 'clash-royale-season',
    title: '클래시 로얄 시즌 50 — 새로운 카드 5종 공개',
    thumbnail: 'https://picsum.photos/seed/mob5/400/225',
    category: { id: 3, name: '모바일', slug: 'mobile' },
    subCategory: { id: 26, name: '기타 모바일', slug: 'mobile-etc' },
    viewCount: 11000,
    readTime: 2,
    publishedAt: '2026-04-03T00:00:00.000Z',
  },
  // e스포츠 5개
  {
    id: 41,
    slug: 't1-lck-final',
    title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
    thumbnail: 'https://picsum.photos/seed/all1/400/225',
    category: { id: 4, name: 'Esports', slug: 'esports' },
    subCategory: { id: 41, name: 'LCK', slug: 'lck' },
    viewCount: 49000,
    readTime: 3,
    publishedAt: '2026-04-10T00:00:00.000Z',
  },
  {
    id: 42,
    slug: 'worlds-schedule',
    title: '2026 LoL 월드챔피언십 일정 공개 — 한국 개최 확정',
    thumbnail: 'https://picsum.photos/seed/es2/400/225',
    category: { id: 4, name: 'Esports', slug: 'esports' },
    subCategory: { id: 41, name: 'LCK', slug: 'lck' },
    viewCount: 37000,
    readTime: 4,
    publishedAt: '2026-04-09T00:00:00.000Z',
  },
  {
    id: 43,
    slug: 'valorant-masters',
    title: 'VCT 마스터즈 도쿄 — 한국팀 4강 전원 진출',
    thumbnail: 'https://picsum.photos/seed/es3/400/225',
    category: { id: 4, name: 'Esports', slug: 'esports' },
    subCategory: { id: 42, name: 'VCT', slug: 'vct' },
    viewCount: 29000,
    readTime: 3,
    publishedAt: '2026-04-08T00:00:00.000Z',
  },
  {
    id: 44,
    slug: 'gsc-final',
    title: 'GSC 결승전 — 역대 최고 시청자 200만 돌파',
    thumbnail: 'https://picsum.photos/seed/es4/400/225',
    category: { id: 4, name: 'Esports', slug: 'esports' },
    subCategory: { id: 44, name: '기타 Esports', slug: 'esports-etc' },
    viewCount: 21000,
    readTime: 2,
    publishedAt: '2026-04-07T00:00:00.000Z',
  },
  {
    id: 45,
    slug: 'dota2-ti2026',
    title: 'Dota2 TI2026 예선 — 한국팀 전원 통과',
    thumbnail: 'https://picsum.photos/seed/es5/400/225',
    category: { id: 4, name: 'Esports', slug: 'esports' },
    subCategory: { id: 44, name: '기타 Esports', slug: 'esports-etc' },
    viewCount: 16000,
    readTime: 3,
    publishedAt: '2026-04-06T00:00:00.000Z',
  },
]

// 커뮤니티 HOT 5개
export const mockCommunityHot: CommunityHot[] = [
  {
    id: 1,
    title: '발로란트 에임 트레이닝 루틴 공유합니다',
    viewCount: 12400,
    slug: 'valorant-aim-training',
  },
  {
    id: 2,
    title: '닌텐도 스위치2 예약 구매 성공했어요',
    viewCount: 9800,
    slug: 'switch2-preorder',
  },
  { id: 3, title: 'T1 결승전 같이 볼 사람 모집', viewCount: 8200, slug: 't1-final-watch' },
  { id: 4, title: '원신 5.0 무과금 공략 총정리', viewCount: 7600, slug: 'genshin-f2p-guide' },
  { id: 5, title: '이번 시즌 최강 클래스 티어리스트', viewCount: 6500, slug: 'season-tier-list' },
]
