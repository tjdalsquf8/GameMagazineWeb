// 에디터 픽 API 함수 모음
// POST /api/editor-picks (어드민 전용), GET /api/editor-picks (public),
// DELETE /api/editor-picks/:id (어드민 전용), GET /api/editor-picks/admin (어드민 전용),
// PATCH /api/editor-picks/:id/hidden (어드민 전용), GET /api/editor-picks/:id (public) 연동
import { apiClient } from '@/lib/api/client'

/** 에디터 픽 생성 요청 DTO */
export interface CreateEditorPickDto {
  title: string
  content: string // sanitize 처리된 HTML
  mainCategory: string
  thumbnailUrl: string // 필수
}

/** 에디터 픽 단건 응답 타입 */
export interface EditorPickItem {
  id: string
  title: string
  content: string
  mainCategory: string
  thumbnailUrl: string
  authorNickname: string
  createdAt: string
  isHidden: boolean
}

/** 에디터 픽 생성 — POST /api/editor-picks (AdminGuard) */
export async function createEditorPick(
  dto: CreateEditorPickDto,
  accessToken: string
): Promise<EditorPickItem> {
  const res = await apiClient.post<EditorPickItem>('/api/editor-picks', dto, {
    token: accessToken,
  })
  if (!res.success) {
    throw new Error(res.error?.message ?? '에디터 픽 등록에 실패했습니다')
  }
  return res.data
}

/** 에디터 픽 목록 조회 — GET /api/editor-picks?limit=N (public) */
export async function fetchEditorPicks(limit = 3): Promise<EditorPickItem[]> {
  const res = await apiClient.get<EditorPickItem[]>(`/api/editor-picks?limit=${limit}`)
  if (!res.success) {
    throw new Error('에디터 픽 목록 조회에 실패했습니다')
  }
  return res.data
}

/** 에디터 픽 삭제 — DELETE /api/editor-picks/:id (AdminGuard) */
export async function deleteEditorPick(id: string, accessToken: string): Promise<void> {
  const res = await apiClient.delete<null>(`/api/editor-picks/${id}`, { token: accessToken })
  if (!res.success) {
    throw new Error(res.error?.message ?? '삭제에 실패했습니다')
  }
}

/** 어드민 에디터 픽 전체 목록 조회 — GET /api/editor-picks/admin?limit=N (AdminGuard, isHidden 포함) */
export async function fetchEditorPicksForAdmin(
  limit = 50,
  accessToken: string
): Promise<EditorPickItem[]> {
  const res = await apiClient.get<EditorPickItem[]>(`/api/editor-picks/admin?limit=${limit}`, {
    token: accessToken,
  })
  if (!res.success) {
    throw new Error('에디터 픽 목록 조회에 실패했습니다')
  }
  return res.data
}

/** 에디터 픽 숨김 토글 — PATCH /api/editor-picks/:id/hidden (AdminGuard) */
export async function toggleEditorPickHidden(
  id: string,
  accessToken: string
): Promise<EditorPickItem> {
  const res = await apiClient.patch<EditorPickItem>(`/api/editor-picks/${id}/hidden`, undefined, {
    token: accessToken,
  })
  if (!res.success) {
    throw new Error(res.error?.message ?? '숨김 상태 변경에 실패했습니다')
  }
  return res.data
}

/** 에디터 픽 단건 조회 — GET /api/editor-picks/:id (public) */
export async function fetchEditorPickById(id: string): Promise<EditorPickItem> {
  const res = await apiClient.get<EditorPickItem>(`/api/editor-picks/${id}`)
  if (!res.success) {
    throw new Error('에디터 픽 조회에 실패했습니다')
  }
  return res.data
}
