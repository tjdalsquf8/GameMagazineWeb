// 커뮤니티에 들어가는 게임 카테고리 정보입니다. 추후 API로 받아올 수도 있지만, 현재는 하드코딩된 데이터를 사용합니다.

export interface Category {
  id: number
  name: string
  slug: string
  children?: Category[]
}

export const COMMUNITY_CATEGORIES: Category[] = [
  {
    id: 1,
    name: '모바일',
    slug: 'mobile',
    children: [
      { id: 9, name: '배틀그라운드 모바일', slug: 'pubg-mobile' },
      { id: 10, name: '원신', slug: 'genshin-impact' },
    ],
  },
  {
    id: 2,
    name: '콘솔',
    slug: 'console',
    children: [
      { id: 7, name: '엘든링', slug: 'elden-ring' },
      { id: 8, name: '파이널판타지', slug: 'final-fantasy' },
    ],
  },
  {
    id: 3,
    name: 'PC',
    slug: 'pc',
    children: [
      { id: 4, name: '배틀그라운드', slug: 'pubg-pc' },
      { id: 5, name: '오버워치', slug: 'overwatch' },
      { id: 6, name: '로스트아크', slug: 'lost-ark' },
    ],
  },
]
