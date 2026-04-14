// 커뮤니티 도메인 타입 정의

export interface PostAuthor {
  id: string
  nickname: string
  profileImage: string | null
}

export interface PostCategory {
  id: number
  name: string
  slug: string
}

export interface Post {
  id: number
  title: string
  content: string
  viewCount: number
  recommendCount: number
  isRecommended: boolean
  createdAt: string
  updatedAt: string
  author: PostAuthor
  category: PostCategory
  _count: { comments: number; postRecommends: number }
}

export interface PostListResponse {
  items: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CommentAuthor {
  id: string
  nickname: string
  profileImage: string | null
}

export interface Reply {
  id: number
  content: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  author: CommentAuthor | null
  recommendCount: number
  isRecommended: boolean
  isDeleted: boolean
}

export interface Comment {
  id: number
  content: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  author: CommentAuthor | null
  parentId?: number | null
  replies: Reply[]
  recommendCount: number
  isRecommended: boolean
  isDeleted: boolean
}

export interface CommentListResponse {
  items: Comment[]
  total: number
}
