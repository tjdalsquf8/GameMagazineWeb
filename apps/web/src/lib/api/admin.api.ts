// 어드민 API fetcher — 대시보드·파이프라인·기사·소스·커뮤니티 관련 실제 백엔드 API 호출 함수 모음

import type {
  AdminStats,
  CategoryCollectionCount,
  PipelineLog,
  PipelineStatus,
  AdminSource,
  AdminArticle,
  ArticleFilter,
  AdminPost,
  PostFilter,
  AdminReport,
  ReportStatus,
} from '@/types/admin.types'
import type { ApiResponse } from '@/types'
import { apiClient } from '@/lib/api/client'

// ─── 대시보드 ─────────────────────────────────────────────────────

/** 대시보드 통계 조회 */
export async function fetchAdminStats(): Promise<ApiResponse<AdminStats>> {
  return await apiClient.get<AdminStats>('/api/admin/stats')
}

/** 카테고리별 수집량 조회 */
export async function fetchCategoryCollectionCounts(): Promise<
  ApiResponse<CategoryCollectionCount[]>
> {
  return await apiClient.get<CategoryCollectionCount[]>('/api/admin/stats/categories')
}

// ─── 파이프라인 ───────────────────────────────────────────────────

/** 파이프라인 상태 조회 */
export async function fetchPipelineStatus(): Promise<ApiResponse<PipelineStatus>> {
  return await apiClient.get<PipelineStatus>('/api/admin/pipeline/status')
}

/** 파이프라인 실행 로그 조회 — 백엔드가 { data, meta } 반환, data 배열만 추출 */
export async function fetchPipelineLogs(page = 1, limit = 50): Promise<ApiResponse<PipelineLog[]>> {
  const res = await apiClient.get<{ data: PipelineLog[]; meta: { total: number; page: number; limit: number } }>(
    `/api/admin/pipeline/logs?page=${page}&limit=${limit}`
  )
  if (!res.success) return res as unknown as ApiResponse<PipelineLog[]>
  return { success: true, data: res.data.data }
}

/** 파이프라인 즉시 실행 */
export async function runPipelineNow(): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.post<{ message: string }>('/api/admin/pipeline/run')
}

/** 파이프라인 일시정지/재개 — pause/resume 별도 엔드포인트 */
export async function togglePipelinePause(
  pause: boolean
): Promise<ApiResponse<{ message: string }>> {
  const path = pause ? '/api/admin/pipeline/pause' : '/api/admin/pipeline/resume'
  return await apiClient.post<{ message: string }>(path)
}

// ─── 소스 ─────────────────────────────────────────────────────────

/** 소스 목록 조회 */
export async function fetchAdminSources(): Promise<ApiResponse<AdminSource[]>> {
  return await apiClient.get<AdminSource[]>('/api/admin/sources')
}

/** 소스 활성화 토글 */
export async function toggleSourceActive(
  id: string,
  isActive: boolean
): Promise<ApiResponse<AdminSource>> {
  return await apiClient.put<AdminSource>(`/api/admin/sources/${id}/toggle`, { isActive })
}

// ─── 기사 ─────────────────────────────────────────────────────────

/** 기사 목록 조회 — { data, meta } 형태로 반환 (페이지네이션 포함) */
export async function fetchAdminArticles(
  filter: Partial<ArticleFilter>
): Promise<ApiResponse<{ data: AdminArticle[]; meta: { total: number; page: number; limit: number } }>> {
  const params = new URLSearchParams()
  if (filter.mainCategory && filter.mainCategory !== 'ALL') params.set('mainCategory', filter.mainCategory)
  if (filter.status && filter.status !== 'ALL') params.set('status', filter.status)
  if (filter.sourceName) params.set('sourceName', filter.sourceName)
  params.set('page', String(filter.page ?? 1))
  params.set('limit', String(filter.limit ?? 30))
  return await apiClient.get<{ data: AdminArticle[]; meta: { total: number; page: number; limit: number } }>(
    `/api/admin/articles?${params.toString()}`
  )
}

/** 기사 숨기기 */
export async function hideArticle(id: string): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.put<{ message: string }>(`/api/admin/articles/${id}/hide`)
}

/** 기사 공개 */
export async function showArticle(id: string): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.put<{ message: string }>(`/api/admin/articles/${id}/show`)
}

/** 실패 기사 재시도 */
export async function retryArticle(id: string): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.post<{ message: string }>(`/api/admin/articles/${id}/retry`)
}

// ─── 커뮤니티 게시글 ──────────────────────────────────────────────

/** 커뮤니티 게시글 목록 조회 — 백엔드가 { data, meta } 반환, posts 배열과 total을 함께 반환 */
export async function fetchAdminPosts(
  filter: Partial<PostFilter>
): Promise<ApiResponse<{ posts: AdminPost[]; total: number }>> {
  const params = new URLSearchParams()
  if (filter.keyword) params.set('search', filter.keyword)
  if (filter.isDeleted !== undefined && filter.isDeleted !== 'ALL') {
    params.set('isDeleted', String(filter.isDeleted))
  }
  if (filter.parentCategoryId !== undefined && filter.parentCategoryId !== 'ALL') {
    params.set('parentCategoryId', String(filter.parentCategoryId))
  }
  if (filter.categoryId !== undefined && filter.categoryId !== 'ALL') {
    params.set('categoryId', String(filter.categoryId))
  }
  params.set('page', String(filter.page ?? 1))
  params.set('limit', String(filter.limit ?? 20))
  const res = await apiClient.get<{ data: AdminPost[]; meta: { total: number; page: number; limit: number } }>(
    `/api/admin/posts?${params.toString()}`
  )
  if (!res.success) return res as unknown as ApiResponse<{ posts: AdminPost[]; total: number }>
  return { success: true, data: { posts: res.data.data, total: res.data.meta.total } }
}

/** 게시글 삭제 (소프트 삭제) */
export async function deleteAdminPost(id: number): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.delete<{ message: string }>(`/api/admin/posts/${id}`)
}

/** 게시글 복구 — deletedAt 제거 및 PUBLISHED 상태 복원 */
export async function restoreAdminPost(id: number): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.put<{ message: string }>(`/api/admin/posts/${id}/restore`)
}

// ─── 신고 ─────────────────────────────────────────────────────────

/** 신고 목록 조회 — 백엔드가 { data, meta } 반환, reports 배열과 total을 함께 반환 */
export async function fetchAdminReports(
  status?: ReportStatus | 'ALL',
  page = 1,
  limit = 20
): Promise<ApiResponse<{ reports: AdminReport[]; total: number }>> {
  const params = new URLSearchParams()
  if (status && status !== 'ALL') params.set('status', status)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const res = await apiClient.get<{ data: AdminReport[]; meta: { total: number; page: number; limit: number } }>(
    `/api/admin/reports?${params.toString()}`
  )
  if (!res.success) return res as unknown as ApiResponse<{ reports: AdminReport[]; total: number }>
  return { success: true, data: { reports: res.data.data, total: res.data.meta.total } }
}

/** 신고 처리 — RESOLVED → 'resolve', DISMISSED → 'reject' 로 변환 후 PATCH */
export async function resolveReport(
  id: string,
  action: 'RESOLVED' | 'DISMISSED'
): Promise<ApiResponse<{ message: string }>> {
  const backendAction = action === 'RESOLVED' ? 'resolve' : 'reject'
  return await apiClient.patch<{ message: string }>(`/api/admin/reports/${id}`, { action: backendAction })
}
