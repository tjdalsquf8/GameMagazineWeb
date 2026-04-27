// 마이페이지 API fetcher — /users/me 관련 모든 API 호출 담당

import { apiClient } from './client'
import type {
  MyProfile,
  MyPost,
  MyComment,
  MyLike,
  NewsHistory,
  NotificationSettings,
  PaginatedResponse,
} from '@/types/my.types'
import type { ApiResponse } from '@/types'

/** 내 프로필 조회 */
export async function fetchMyProfile(): Promise<ApiResponse<MyProfile>> {
  return apiClient.get<MyProfile>('/api/users/me')
}

/** 닉네임 변경 */
export async function updateNickname(nickname: string): Promise<ApiResponse<MyProfile>> {
  return apiClient.patch<MyProfile>('/api/users/me', { nickname })
}

/** 비밀번호 변경 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.patch<{ message: string }>('/api/users/me/password', {
    currentPassword,
    newPassword,
  })
}

/** 내 게시글 목록 조회 */
export async function fetchMyPosts(
  page: number,
  limit: number
): Promise<ApiResponse<PaginatedResponse<MyPost>>> {
  return apiClient.get<PaginatedResponse<MyPost>>(`/api/users/me/posts?page=${page}&limit=${limit}`)
}

/** 내가 쓴 댓글 목록 조회 */
export async function fetchMyComments(
  page: number,
  limit: number
): Promise<ApiResponse<PaginatedResponse<MyComment>>> {
  return apiClient.get<PaginatedResponse<MyComment>>(
    `/api/users/me/comments?page=${page}&limit=${limit}`
  )
}

/** 좋아요한 글 목록 조회 */
export async function fetchMyLikes(
  page: number,
  limit: number
): Promise<ApiResponse<PaginatedResponse<MyLike>>> {
  return apiClient.get<PaginatedResponse<MyLike>>(`/api/users/me/likes?page=${page}&limit=${limit}`)
}

/** 최근 읽은 뉴스 목록 조회 */
export async function fetchNewsHistory(
  page: number,
  limit: number
): Promise<ApiResponse<PaginatedResponse<NewsHistory>>> {
  return apiClient.get<PaginatedResponse<NewsHistory>>(
    `/api/users/me/news-history?page=${page}&limit=${limit}`
  )
}

/** 알림 설정 변경 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<ApiResponse<NotificationSettings>> {
  return apiClient.patch<NotificationSettings>('/api/users/me/notifications', settings)
}

/** 회원 탈퇴 */
export async function deleteAccount(): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>('/api/users/me')
}
