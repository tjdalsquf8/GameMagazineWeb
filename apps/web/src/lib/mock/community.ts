// 커뮤니티 Mock 데이터

export interface MockCategory {
  id: number
  name: string
  slug: string
  parentId: number | null
}

export interface MockPostAuthor {
  id: string
  nickname: string
}

export interface MockPostCategory {
  id: number
  name: string
}

export interface MockPost {
  id: number
  title: string
  category: MockPostCategory
  author: MockPostAuthor
  viewCount: number
  commentCount: number
  createdAt: string
}

export interface MockPostDetail {
  id: number
  title: string
  content: string
  category: MockPostCategory
  author: MockPostAuthor
  viewCount: number
  createdAt: string
}

export interface MockReply {
  id: number
  content: string
  author: MockPostAuthor
  createdAt: string
  deletedAt: string | null
}

export interface MockComment {
  id: number
  content: string
  author: MockPostAuthor
  createdAt: string
  deletedAt: string | null
  replies: MockReply[]
}

export const mockCategories: MockCategory[] = [
  { id: 1, name: '전체', slug: 'all', parentId: null },
  { id: 2, name: '모바일', slug: 'mobile', parentId: null },
  { id: 3, name: '배틀그라운드 모바일', slug: 'pubg-mobile', parentId: 2 },
  { id: 4, name: '원신', slug: 'genshin', parentId: 2 },
  { id: 5, name: '콘솔', slug: 'console', parentId: null },
  { id: 6, name: '엘든링', slug: 'elden-ring', parentId: 5 },
  { id: 7, name: '파이널판타지', slug: 'ff', parentId: 5 },
  { id: 8, name: 'PC', slug: 'pc', parentId: null },
  { id: 9, name: '배틀그라운드', slug: 'pubg', parentId: 8 },
  { id: 10, name: '오버워치', slug: 'overwatch', parentId: 8 },
  { id: 11, name: '로스트아크', slug: 'lostark', parentId: 8 },
]

const POST_TITLES = [
  '오늘 솔로 스쿼드 15킬 달성했습니다',
  '배그 초보인데 좋은 팁 있으면 공유해주세요',
  '새 업데이트 이후 총기 밸런스 어떻게 생각하시나요?',
  '발로란트 플래티넘 달성 후기',
  '로스트아크 레이드 파티원 구합니다',
  '이번 시즌 배틀패스 살 가치 있나요?',
  '게임 렉이 너무 심한데 해결 방법 아시는 분?',
  '스나이퍼 조준 연습 방법 공유합니다',
  '신규 캐릭터 스킬 트리 분석',
  '오늘 최고의 플레이 클립 올립니다',
  '핵 유저 신고하는 방법 알려주세요',
  '드디어 다이아 달성! 감사합니다',
  '주간 퀘스트 보상이 너무 적은 것 같아요',
  '게임 내 친구 추가 시스템 개선 요망',
  '클랜 모집합니다 - 주 3회 이상 플레이 가능자',
  '이번 대회 결과 어떻게 보셨나요?',
  '배틀그라운드 맵 변경 소식 어떻게 생각하세요?',
  '초보자를 위한 총기 가이드 작성해봤습니다',
  '서버 점검 언제 끝나나요...',
  '오늘 팀원이 너무 잘해줘서 우승했어요!',
]

const CATEGORY_LIST: MockPostCategory[] = [
  { id: 9, name: '배틀그라운드' },
  { id: 10, name: '오버워치' },
  { id: 11, name: '로스트아크' },
]

export const mockPosts: MockPost[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: POST_TITLES[i] ?? `게시글 제목 예시 ${i + 1}`,
  category: CATEGORY_LIST[i % CATEGORY_LIST.length] as MockPostCategory,
  author: { id: `user-${i + 1}`, nickname: `유저${i + 1}` },
  viewCount: Math.floor((i + 1) * 47 + 13),
  commentCount: Math.floor(i * 2.3 + 1),
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}))

export const mockPostDetail: MockPostDetail = {
  id: 1,
  title: '오늘 솔로 스쿼드 15킬 달성했습니다',
  content: `안녕하세요! 오늘 드디어 솔로 스쿼드에서 15킬을 달성했습니다.

처음에는 에란겔 북쪽 스쿨에서 드랍했는데 거기서 초반 교전을 정리하고 나서 계속 이동하다가 파이널 존이 공장 근처로 잡혔어요.

주로 사용한 무기는 M416 + AWM 조합이었습니다. AWM은 에어드랍에서 겨우 하나 먹었는데 정말 효자 총이더라고요.

파이널 5인 상황에서 순위 압박 없이 공격적으로 치고 들어가는 게 핵심이었어요. 숨어서 기다리면 포지션 잡기가 더 어려워지거든요.

다들 좋은 플레이 하시길 바랍니다! 궁금한 점 있으면 댓글로 질문해주세요.

팁 요약:
- 초반 루팅을 빠르게 마치고 이동
- 존 이동 시 항상 엄폐물 활용
- 파이널에서는 소극적인 플레이보다 능동적 포지셔닝
- 팀 편제가 확인되면 약한 쪽부터 공략`,
  category: { id: 9, name: '배틀그라운드' },
  author: { id: 'user-1', nickname: '유저1' },
  viewCount: 342,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
}

export const mockComments: MockComment[] = [
  {
    id: 1,
    content: '대단하시네요! 저는 10킬도 어려운데 비법이 뭔가요?',
    author: { id: 'user-5', nickname: '유저5' },
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    deletedAt: null,
    replies: [
      {
        id: 2,
        content: '연습만이 살 길이에요 ㅎㅎ 꾸준히 하시면 됩니다!',
        author: { id: 'user-1', nickname: '유저1' },
        createdAt: new Date(Date.now() - 2800000).toISOString(),
        deletedAt: null,
      },
      {
        id: 3,
        content: '저도 궁금했는데 감사합니다',
        author: { id: 'user-7', nickname: '유저7' },
        createdAt: new Date(Date.now() - 2600000).toISOString(),
        deletedAt: null,
      },
    ],
  },
  {
    id: 4,
    content: 'AWM 조합이 최고죠! 다음엔 영상도 올려주세요',
    author: { id: 'user-8', nickname: '유저8' },
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    deletedAt: null,
    replies: [],
  },
  {
    id: 5,
    content: '',
    author: { id: 'user-9', nickname: '삭제유저' },
    createdAt: new Date(Date.now() - 2200000).toISOString(),
    deletedAt: new Date(Date.now() - 2000000).toISOString(),
    replies: [],
  },
  {
    id: 6,
    content: '스쿨에서 초반 교전 정리하는 게 진짜 어렵던데 ㄷㄷ',
    author: { id: 'user-10', nickname: '유저10' },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    deletedAt: null,
    replies: [
      {
        id: 7,
        content: '맞아요 스쿨은 드랍 후 빠른 루팅이 핵심이에요',
        author: { id: 'user-1', nickname: '유저1' },
        createdAt: new Date(Date.now() - 1600000).toISOString(),
        deletedAt: null,
      },
    ],
  },
]

export const mockPopularPosts: MockPost[] = mockPosts.slice(0, 5).map((post, i) => ({
  ...post,
  viewCount: 1200 - i * 180,
}))
