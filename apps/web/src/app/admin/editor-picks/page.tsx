'use client'

// 어드민 에디터 픽 관리 페이지
// 기본 화면: 에디터 픽 목록 표시 + 숨김 토글 + 삭제 기능
// "작성하기" 버튼으로 작성 폼 화면으로 전환, 제출/뒤로가기 시 목록으로 복귀
// CSR 전용 — 어드민 레이아웃 전체가 인증 필요, SEO 불필요

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import {
  fetchEditorPicksForAdmin,
  deleteEditorPick,
  toggleEditorPickHidden,
} from '@/lib/api/editor-picks.api'
import type { EditorPickItem } from '@/lib/api/editor-picks.api'
import EditorPickWriteForm from '@/components/admin/EditorPickWriteForm'

/** 화면 뷰 상태 타입 */
type ViewState = 'list' | 'write'

/** 날짜 문자열을 읽기 쉬운 형식으로 포맷 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/** 에디터 픽 목록 화면 — 목록 조회 + 숨김 토글 + 아이템 별 삭제 기능 */
function EditorPickList({ onWriteClick }: { onWriteClick: () => void }) {
  const { accessToken } = useAuth()
  const { showToast } = useToastStore()

  const [items, setItems] = useState<EditorPickItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  /** 에디터 픽 목록 불러오기 — 어드민 전용 엔드포인트, limit 50으로 전체 표시 */
  const loadItems = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await fetchEditorPicksForAdmin(50, accessToken)
      setItems(data)
    } catch {
      showToast('목록을 불러오는 데 실패했습니다', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, showToast])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  /** 숨김/공개 토글 버튼 클릭 — API 호출 후 해당 아이템의 isHidden 상태만 업데이트 */
  const handleToggleHidden = async (item: EditorPickItem) => {
    if (!accessToken) {
      showToast('로그인이 필요합니다', 'error')
      return
    }

    setTogglingId(item.id)
    try {
      const updated = await toggleEditorPickHidden(item.id, accessToken)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      showToast(updated.isHidden ? '숨김 처리되었습니다' : '공개 처리되었습니다', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '숨김 상태 변경에 실패했습니다', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  /** 삭제 버튼 클릭 — confirm 후 삭제 API 호출 + 목록 새로고침 */
  const handleDelete = async (item: EditorPickItem) => {
    if (!accessToken) {
      showToast('로그인이 필요합니다', 'error')
      return
    }
    if (!window.confirm(`"${item.title}" 을(를) 삭제하시겠습니까?`)) return

    setDeletingId(item.id)
    try {
      await deleteEditorPick(item.id, accessToken)
      showToast('삭제되었습니다', 'success')
      await loadItems()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '삭제에 실패했습니다', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* 헤더 — 제목 + 작성하기 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">에디터 픽 관리</h1>
        <button
          type="button"
          onClick={onWriteClick}
          className="px-4 py-2 text-sm rounded bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-colors duration-150"
        >
          작성하기
        </button>
      </div>

      {/* 목록 영역 */}
      {isLoading ? (
        // 로딩 중 스켈레톤
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border border-[var(--color-border)] rounded-lg animate-pulse"
            >
              <div className="w-20 h-14 bg-[var(--color-surface)] rounded flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-surface)] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        // 목록 비어있을 때 안내
        <div className="flex items-center justify-center py-16 text-sm text-[var(--color-text-muted)]">
          작성된 에디터 픽이 없습니다
        </div>
      ) : (
        // 아이템 목록
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={[
                'flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors',
                item.isHidden ? 'opacity-50' : '',
              ]
                .join(' ')
                .trim()}
            >
              {/* 썸네일 */}
              <div className="relative w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-[var(--color-border)]">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* 아이템 정보 */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/editor-picks/${item.id}`}
                  className="text-sm font-medium text-[var(--color-text-primary)] truncate hover:text-[var(--color-primary)] transition-colors block"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--color-border)] mr-2">
                    {item.mainCategory}
                  </span>
                  {item.authorNickname} · {formatDate(item.createdAt)}
                </p>
              </div>

              {/* 숨김/공개 토글 버튼 */}
              <button
                type="button"
                onClick={() => handleToggleHidden(item)}
                disabled={togglingId === item.id || deletingId === item.id}
                className={[
                  'flex-shrink-0 px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  item.isHidden
                    ? 'border-blue-400 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'border-gray-400 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                ].join(' ')}
              >
                {togglingId === item.id ? '처리 중...' : item.isHidden ? '공개' : '숨기기'}
              </button>

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => handleDelete(item)}
                disabled={deletingId === item.id || togglingId === item.id}
                className="flex-shrink-0 px-3 py-1.5 text-xs rounded border border-red-400 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === item.id ? '삭제 중...' : '삭제'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** 에디터 픽 관리 페이지 — list/write 뷰 전환 관리 */
export default function EditorPicksPage() {
  const [view, setView] = useState<ViewState>('list')
  const [listKey, setListKey] = useState(0)

  /** 작성 완료 또는 뒤로가기 시 목록으로 복귀 + 목록 새로고침 */
  const handleBackToList = () => {
    setView('list')
    setListKey((prev) => prev + 1)
  }

  if (view === 'write') {
    return (
      <div className="w-full max-w-[800px] mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={handleBackToList}
          className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-5 transition-colors"
        >
          <ChevronLeft size={16} />
          목록으로
        </button>

        {/* 작성 폼 — 제출 성공 시 목록으로 복귀 */}
        <Suspense
          fallback={
            <div className="w-full animate-pulse">
              <div className="h-7 w-48 bg-[var(--color-surface)] rounded mb-6" />
              <div className="flex flex-col gap-5">
                <div className="h-10 bg-[var(--color-surface)] rounded" />
                <div className="h-10 bg-[var(--color-surface)] rounded" />
                <div className="h-32 bg-[var(--color-surface)] rounded" />
                <div className="h-64 bg-[var(--color-surface)] rounded" />
              </div>
            </div>
          }
        >
          <EditorPickWriteForm onSuccess={handleBackToList} />
        </Suspense>
      </div>
    )
  }

  return <EditorPickList key={listKey} onWriteClick={() => setView('write')} />
}
