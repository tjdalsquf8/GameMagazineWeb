// 커뮤니티에 들어가는 게임 카테고리 정보입니다. 추후 API로 받아올 수도 있지만, 현재는 하드코딩된 데이터를 사용합니다.

export interface Category {
  id: number
  name: string
  slug: string
  children?: Category[]
}

// DB categories 테이블 기준 — 순서: PC / 모바일 / 콘솔 / Esports
export const COMMUNITY_CATEGORIES: Category[] = [
  {
    id: 3,
    name: 'PC',
    slug: 'pc',
    children: [
      { id: 5, name: '리그오브레전드', slug: 'league-of-legends' },
      { id: 6, name: '발로란트', slug: 'valorant' },
      { id: 7, name: '오버워치', slug: 'overwatch' },
      { id: 8, name: '배틀그라운드', slug: 'pubg-pc' },
      { id: 9, name: '로스트아크', slug: 'lost-ark' },
      { id: 10, name: '메이플스토리', slug: 'maplestory' },
      { id: 11, name: '던전앤파이터', slug: 'dnf' },
      { id: 12, name: '디아블로', slug: 'diablo' },
      { id: 13, name: '붉은사막', slug: 'crimson-desert' },
      { id: 14, name: '기타 PC', slug: 'etc-pc' },
    ],
  },
  {
    id: 1,
    name: '모바일',
    slug: 'mobile',
    children: [
      { id: 15, name: '원신', slug: 'genshin-impact' },
      { id: 16, name: '붕괴: 스타레일', slug: 'honkai-star-rail' },
      { id: 17, name: '워스텔링', slug: 'worthtelling' },
      { id: 18, name: '배틀그라운드 모바일', slug: 'pubg-mobile' },
      { id: 19, name: '리니지M', slug: 'lineage-m' },
      { id: 20, name: '나혼자만레벨업', slug: 'solo-leveling' },
      { id: 21, name: '메이플스토리M', slug: 'maplestory-m' },
      { id: 22, name: '승리의 여신: 니케', slug: 'nikke' },
      { id: 23, name: '기타 모바일', slug: 'etc-mobile' },
    ],
  },
  {
    id: 2,
    name: '콘솔',
    slug: 'console',
    children: [
      { id: 24, name: 'PlayStation', slug: 'playstation' },
      { id: 25, name: 'Xbox', slug: 'xbox' },
      { id: 26, name: 'Nintendo', slug: 'nintendo' },
    ],
  },
  {
    id: 4,
    name: 'Esports',
    slug: 'esports',
    children: [
      { id: 30, name: 'LCK', slug: 'lck' },
      { id: 31, name: 'VCT', slug: 'vct' },
    ],
  },
]
