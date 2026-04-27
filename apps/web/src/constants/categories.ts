// 카테고리 상수 — 대분류/소분류 API 파라미터 값 기준으로 정의
// CategoryFilter, NewsMainClient에서 공통으로 사용

// 대분류 탭 목록 — label(표시명), apiValue(API 파라미터 값)
export const MAIN_CATEGORIES = [
  { label: '전체', apiValue: '' },
  { label: 'PC', apiValue: 'PC' },
  { label: '모바일', apiValue: 'Mobile' },
  { label: '콘솔', apiValue: 'Console' },
  { label: 'Esports', apiValue: 'Esports' },
] as const

// MAIN_CATEGORIES apiValue의 유니온 타입
export type MainCategoryValue = (typeof MAIN_CATEGORIES)[number]['apiValue']

// 소분류 목록 — API mainCategory 값 기준 키
export const SUB_CATEGORIES: Record<string, string[]> = {
  PC: [
    '리그오브레전드',
    '발로란트',
    '오버워치',
    '배틀그라운드',
    '로스트아크',
    '메이플스토리',
    '던전앤파이터',
    '디아블로',
    '붉은사막',
    '기타 PC',
  ],
  Mobile: [
    '원신',
    '붕괴: 스타레일',
    '워스텔링',
    '배틀그라운드 모바일',
    '리니지M',
    '나혼자만레벨업',
    '메이플스토리M',
    '승리의 여신: 니케',
    '기타 모바일',
  ],
  Console: ['PlayStation', 'Xbox', 'Nintendo'],
  Esports: ['LCK', 'VCT', '기타 Esports'],
}
