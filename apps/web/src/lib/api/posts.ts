// posts.ts
// 게시글 및 댓글 관련 API 호출 함수 모음

import { apiClient } from './client'
import type { Post, PostListResponse, CommentListResponse, Comment } from '@/types/community'
import type { ApiSuccess } from '@/types'

export interface GetPostsParams {
  page?: number
  limit?: number
  categoryId?: number
  sort?: 'latest' | 'popular' | 'comments'
  search?: string
}

/** 게시글 목록 조회 */
export async function getPosts(params?: GetPostsParams): Promise<PostListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  if (params?.categoryId !== undefined) searchParams.set('categoryId', String(params.categoryId))
  if (params?.sort !== undefined) searchParams.set('sort', params.sort)
  if (params?.search !== undefined && params.search.trim() !== '') {
    searchParams.set('search', params.search.trim())
  }

  const query = searchParams.toString()
  const path = query ? `/api/posts?${query}` : '/api/posts'
  const res = await apiClient.get<PostListResponse>(path)

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  // GET /posts 가 { success: true, data: { items, total, ... } } 포맷으로 응답하는 경우 unwrap
  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<PostListResponse>).data
  }

  return res as unknown as PostListResponse
}

/** 게시글 단건 조회 (조회수 증가 없음) */
export async function getPost(postId: number): Promise<Post> {
  const res = await apiClient.get<Post>(`/api/posts/${postId}`)

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  // GET /posts/:id 는 { success: true, data: Post } 형태
  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<Post>).data
  }

  return res as unknown as Post
}

/** 조회수 증가 전용 API 호출 — POST /posts/:id/view */
export async function incrementPostView(postId: number): Promise<void> {
  await apiClient.post<{ success: boolean }>(`/api/posts/${postId}/view`, {})
}

/** 게시글 생성 */
export async function createPost(
  body: { title: string; content: string; categoryId: number },
  token: string
): Promise<Post> {
  const res = await apiClient.post<Post>('/api/posts', body, { token })

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<Post>).data
  }

  return res as unknown as Post
}

/** 게시글 수정 */
export async function updatePost(
  postId: number,
  body: { title?: string; content?: string },
  token: string
): Promise<Post> {
  const res = await apiClient.patch<Post>(`/api/posts/${postId}`, body, { token })

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<Post>).data
  }

  return res as unknown as Post
}

/** 게시글 삭제 */
export async function deletePost(postId: number, token: string): Promise<void> {
  const res = await apiClient.delete<{ message: string }>(`/api/posts/${postId}`, { token })

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }
}

/** 댓글 목록 조회 */
export async function getComments(postId: number): Promise<CommentListResponse> {
  const res = await apiClient.get<CommentListResponse>(`/api/posts/${postId}/comments`)

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  // GET /posts/:postId/comments 가 { success: true, data: { items, total } } 포맷으로 응답하는 경우 unwrap
  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<CommentListResponse>).data
  }

  return res as unknown as CommentListResponse
}

/** 댓글 작성 */
export async function createComment(
  postId: number,
  body: { content: string; parentId?: number },
  token: string
): Promise<Comment> {
  const res = await apiClient.post<Comment>(`/api/posts/${postId}/comments`, body, { token })

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<Comment>).data
  }

  return res as unknown as Comment
}

/** 댓글 수정 */
export async function updateComment(
  postId: number,
  commentId: number,
  body: { content: string },
  token: string
): Promise<Comment> {
  const res = await apiClient.patch<Comment>(`/api/posts/${postId}/comments/${commentId}`, body, {
    token,
  })

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<Comment>).data
  }

  return res as unknown as Comment
}

/** 댓글 삭제 */
export async function deleteComment(
  postId: number,
  commentId: number,
  token: string
): Promise<void> {
  const res = await apiClient.delete<{ message: string }>(
    `/api/posts/${postId}/comments/${commentId}`,
    { token }
  )

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }
}

/** 게시글 추천 토글 */
export async function togglePostRecommend(
  postId: number,
  token: string
): Promise<{ recommended: boolean; recommendCount: number }> {
  const res = await apiClient.post<{ recommended: boolean; recommendCount: number }>(
    `/api/posts/${postId}/recommend`,
    {},
    { token }
  )

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<{ recommended: boolean; recommendCount: number }>).data
  }

  return res as unknown as { recommended: boolean; recommendCount: number }
}

/** 게시글 신고 — 중복 신고 시 409 에러 */
export async function reportPost(
  postId: number,
  reason: string,
  token: string
): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    `/api/posts/${postId}/report`,
    { reason },
    { token }
  )

  if ('success' in res && !res.success) {
    const err = res as { success: false; error: { code: string; message: string } }
    throw Object.assign(new Error(err.error.message), { code: err.error.code })
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<{ message: string }>).data
  }

  return res as unknown as { message: string }
}

/** 댓글/대댓글 신고 — 중복 신고 시 409 에러 */
export async function reportComment(
  postId: number,
  commentId: number,
  reason: string,
  token: string
): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    `/api/posts/${postId}/comments/${commentId}/report`,
    { reason },
    { token }
  )

  if ('success' in res && !res.success) {
    const err = res as { success: false; error: { code: string; message: string } }
    throw Object.assign(new Error(err.error.message), { code: err.error.code })
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<{ message: string }>).data
  }

  return res as unknown as { message: string }
}

/** 댓글 추천 토글 */
export async function toggleCommentRecommend(
  postId: number,
  commentId: number,
  token: string
): Promise<{ recommended: boolean; recommendCount: number }> {
  const res = await apiClient.post<{ recommended: boolean; recommendCount: number }>(
    `/api/posts/${postId}/comments/${commentId}/recommend`,
    {},
    { token }
  )

  if ('success' in res && !res.success) {
    throw new Error((res as { success: false; error: { message: string } }).error.message)
  }

  if ('success' in res && res.success && 'data' in res) {
    return (res as ApiSuccess<{ recommended: boolean; recommendCount: number }>).data
  }

  return res as unknown as { recommended: boolean; recommendCount: number }
}
