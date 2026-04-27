// 마이페이지 도메인 타입 정의

/** 내 프로필 정보 */
export interface MyProfile {
  id: string
  email: string
  nickname: string
  role: string
  provider: string
  profileImage: string | null
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
    comments: number
    likes: number
  }
}

/** 내 게시글 항목 */
export interface MyPost {
  id: number
  title: string
  createdAt: string
  viewCount: number
  category: {
    id: number
    name: string
    slug: string
  }
  _count: {
    comments: number
    postRecommends: number
  }
}

/** 내가 쓴 댓글 항목 */
export interface MyComment {
  id: number
  content: string
  createdAt: string
  recommendCount: number
  post: {
    id: number
    title: string
  }
}

/** 좋아요한 글 항목 */
export interface MyLike {
  id: number
  post: {
    id: number
    title: string
    createdAt: string
    category: {
      id: number
      name: string
      slug: string
    }
    _count: {
      comments: number
      postRecommends: number
    }
  }
}

/** 최근 읽은 뉴스 항목 */
export interface NewsHistory {
  id: string
  title: string
  category: string
  thumbnailUrl: string | null
  readAt: string
}

/** 알림 설정 */
export interface NotificationSettings {
  postComment: boolean
  lckResult: boolean
  marketing: boolean
}

/** 페이지네이션 응답 래퍼 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
