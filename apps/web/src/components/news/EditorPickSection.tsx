'use client'

// 에디터 픽 섹션 컴포넌트
// GET /api/editor-picks?limit=3 으로 최신 3개 에디터 픽을 조회하여 노출
// 로딩 중 Skeleton UI, 빈 상태/에러 시 섹션 전체 숨김
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchEditorPicks, type EditorPickItem } from '@/lib/api/editor-picks.api'

// 에디터 픽 단건 카드 컴포넌트
function EditorPickCard({ item }: { item: EditorPickItem & { href: string } }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors"
    >
      {/* 썸네일 영역 */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--color-surface-hover)]">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* 카드 본문 */}
      <div className="flex flex-col gap-1 p-2.5 sm:p-3">
        {/* 카테고리 레이블 */}
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
          {item.mainCategory}
        </span>

        {/* 제목 */}
        <h3 className="text-sm font-semibold leading-snug text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

// 로딩 Skeleton 카드
function EditorPickSkeleton() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] animate-pulse">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-col gap-2 p-3 sm:p-4">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}

// 에디터 픽 섹션 최상위 컴포넌트 — NewsMainClient에서 HeroSection 하단에 삽입
export function EditorPickSection() {
  const [items, setItems] = useState<EditorPickItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 마운트 시 에디터 픽 목록 조회
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setHasError(false)

    fetchEditorPicks(3)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // 에러 또는 데이터 없음 — 섹션 숨김
  if (!isLoading && (hasError || items.length === 0)) return null

  return (
    <section aria-label="에디터 픽" className="w-full">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            에디터 픽
          </h2>
          {/* 구분선 장식 */}
          <span className="hidden sm:block h-px w-12 bg-[var(--color-border)]" />
        </div>
        {/* 추후 "전체보기" 링크 자리 */}
        <span className="text-xs text-[var(--color-text-muted)]">편집부 선정</span>
      </div>

      {/* 카드 그리드
          - 모바일: 가로 스크롤 (스냅 적용)
          - sm 이상: 2열 그리드
          - lg 이상: 3열 그리드
      */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:pb-0">
        {isLoading
          ? // 로딩 Skeleton 3개
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="min-w-[60vw] snap-start sm:min-w-0">
                <EditorPickSkeleton />
              </div>
            ))
          : items.map((item) => (
              <div key={item.id} className="min-w-[60vw] snap-start sm:min-w-0">
                <EditorPickCard
                  item={{
                    ...item,
                    href: `/editor-picks/${item.id}`,
                  }}
                />
              </div>
            ))}
      </div>
    </section>
  )
}
