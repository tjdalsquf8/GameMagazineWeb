// 어드민 기사 관리 페이지 — 필터(대분류·상태·소스) + 기사 테이블
// 실패 기사 빨간 배경, 숨김 기사 회색 처리
// 원문 제목 컬럼 토글, 숨김/카드뉴스 컬럼 분리
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import {
  fetchAdminArticles,
  fetchAdminSources,
  hideArticle,
  showArticle,
} from '@/lib/api/admin.api'
import type { AdminArticle, ArticleFilter, MainCategory, ArticleStatus } from '@/types/admin.types'
import {
  Eye,
  EyeOff,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  ChevronDown,
} from 'lucide-react'
import CardNewsModal from '@/components/admin/CardNewsModal'

// ─── 상수 ─────────────────────────────────────────────────────────

/** 대분류 탭 목록 */
const MAIN_CATEGORIES: { key: MainCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PC', label: 'PC' },
  { key: 'MOBILE', label: 'Mobile' },
  { key: 'CONSOLE', label: 'Console' },
  { key: 'ESPORTS', label: 'Esports' },
]

/** 상태 필터 옵션 */
const STATUS_OPTIONS: { key: ArticleStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체 상태' },
  { key: 'PUBLISHED', label: '발행됨' },
  { key: 'HIDDEN', label: '숨김' },
]

// ─── 유틸 ─────────────────────────────────────────────────────────

/** KST 날짜 포맷 */
function formatKST(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 기사 상태 배지 스타일 */
function statusBadgeClass(status: AdminArticle['status']): string {
  const map: Record<AdminArticle['status'], string> = {
    PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    HIDDEN: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return map[status] ?? ''
}

/** 기사 상태 한국어 라벨 */
function statusLabel(status: AdminArticle['status']): string {
  const map: Record<AdminArticle['status'], string> = {
    PUBLISHED: '발행됨',
    HIDDEN: '숨김',
    FAILED: '실패',
    PENDING: '대기중',
  }
  return map[status] ?? status
}

/** 분류 방법 배지 스타일 */
function methodBadgeClass(method: AdminArticle['classificationMethod']): string {
  const map: Record<AdminArticle['classificationMethod'], string> = {
    AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    MANUAL: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    RULE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }
  return map[method] ?? ''
}

/** 기사 행 배경색 */
function rowBgClass(status: AdminArticle['status']): string {
  if (status === 'FAILED') return 'bg-red-50 dark:bg-red-950/20'
  if (status === 'HIDDEN') return 'opacity-60'
  return ''
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────

/** 기사 관리 페이지 컴포넌트 */
export default function AdminArticlesPage() {
  const { showToast } = useToastStore()

  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [total, setTotal] = useState(0)
  const [sourceNames, setSourceNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  /** 원문 제목 컬럼 표시 여부 */
  const [showOriginalTitle, setShowOriginalTitle] = useState(false)
  /** 카드뉴스 모달 대상 기사 — null이면 모달 닫힘 */
  const [cardNewsArticle, setCardNewsArticle] = useState<{ id: string; title: string } | null>(null)
  const [filter, setFilter] = useState<ArticleFilter>({
    mainCategory: 'ALL',
    status: 'ALL',
    sourceName: '',
    page: 1,
    limit: 30,
  })

  const totalPages = Math.ceil(total / filter.limit)

  /** 기사 목록 로드 */
  const loadArticles = useCallback(async (currentFilter: ArticleFilter) => {
    setIsLoading(true)
    try {
      const res = await fetchAdminArticles(currentFilter)
      if (res.success) {
        setArticles(res.data.data)
        setTotal(res.data.meta.total)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /** 소스 목록 로드 — 마운트 시 1회 */
  useEffect(() => {
    fetchAdminSources().then((res) => {
      if (res.success) setSourceNames(res.data.map((s) => s.name))
    })
  }, [])

  useEffect(() => {
    loadArticles(filter)
  }, [filter, loadArticles])

  /** 대분류 탭 변경 */
  const handleCategoryChange = (category: MainCategory) => {
    setFilter((prev) => ({ ...prev, mainCategory: category, page: 1 }))
  }

  /** 상태 필터 변경 */
  const handleStatusChange = (status: ArticleStatus | 'ALL') => {
    setFilter((prev) => ({ ...prev, status, page: 1 }))
  }

  /** 소스 필터 변경 */
  const handleSourceChange = (sourceName: string) => {
    setFilter((prev) => ({ ...prev, sourceName, page: 1 }))
  }

  /** 페이지 변경 */
  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** 기사 숨기기/공개 */
  const handleVisibilityToggle = async (article: AdminArticle) => {
    const isHidden = article.status === 'HIDDEN'
    const res = isHidden ? await showArticle(article.id) : await hideArticle(article.id)
    if (res.success) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, status: isHidden ? 'PUBLISHED' : 'HIDDEN' } : a
        )
      )
      showToast(res.data.message, 'success')
    } else {
      showToast('처리에 실패했습니다.', 'error')
    }
  }

  return (
    <div className="space-y-5">
      {/* 페이지 헤더 */}
      <h1 className="text-xl font-bold text-[var(--color-text-primary)]">기사 관리</h1>

      {/* 필터 영역 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-4 space-y-3">
        {/* 대분류 탭 */}
        <div className="flex gap-1 flex-wrap">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategoryChange(cat.key)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filter.mainCategory === cat.key
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 상태·소스 필터 */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filter.status}
            onChange={(e) => handleStatusChange(e.target.value as ArticleStatus | 'ALL')}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white dark:bg-gray-800 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filter.sourceName}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white dark:bg-gray-800 text-sm text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">전체 소스</option>
            {sourceNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 기사 테이블 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <RefreshCw size={22} className="animate-spin text-[var(--color-text-muted)]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <tr>
                  {/* 제목 + 원문 제목 토글 버튼 (토글 버튼은 항상 표시) */}
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      제목
                      <button
                        type="button"
                        onClick={() => setShowOriginalTitle((v) => !v)}
                        className="flex items-center gap-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)] rounded px-1 py-0.5 text-[10px]"
                        title={showOriginalTitle ? '원문 제목 숨기기' : '원문 제목 표시'}
                      >
                        원문
                        <ChevronDown
                          size={10}
                          className={`opacity-60 transition-transform ${showOriginalTitle ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </span>
                  </th>
                  {/* 원문 제목 — th/td 모두 항상 DOM에 유지, CSS hidden으로 함께 숨김 / 모바일에서는 항상 hidden */}
                  <th
                    className={`text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap ${showOriginalTitle ? 'hidden md:table-cell' : 'hidden'}`}
                  >
                    원문 제목
                  </th>
                  <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                    카테고리
                  </th>
                  <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">
                    소스
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">
                    분류
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">
                    상태
                  </th>
                  <th className="hidden md:table-cell text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                    발행일
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">
                    숨김
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                    카드뉴스
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {articles.length === 0 ? (
                  <tr>
                    {/* 모바일: 제목+분류+상태+숨김+카드뉴스 = 5 / 데스크탑: 전체 9 (원문제목 미표시 기준) */}
                    <td colSpan={5} className="py-10 text-center text-[var(--color-text-muted)] md:hidden">
                      조건에 맞는 기사가 없습니다.
                    </td>
                    <td colSpan={9} className="hidden md:table-cell py-10 text-center text-[var(--color-text-muted)]">
                      조건에 맞는 기사가 없습니다.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      onClick={() => window.open('/news/' + article.id, '_blank')}
                      className={[
                        'cursor-pointer hover:bg-[var(--color-surface)] transition-colors',
                        rowBgClass(article.status),
                      ].join(' ')}
                    >
                      {/* 제목 */}
                      <td className="px-4 py-3 max-w-[200px] truncate text-[var(--color-text-primary)] font-medium">
                        {article.title}
                      </td>
                      {/* 원문 제목 — td는 항상 DOM에 유지, CSS로만 숨김 / 모바일에서는 항상 hidden */}
                      <td
                        className={`px-4 py-3 max-w-[160px] truncate text-[var(--color-text-muted)] text-xs ${showOriginalTitle ? 'hidden md:table-cell' : 'hidden'}`}
                      >
                        {article.originalTitle}
                      </td>
                      {/* 카테고리 — 모바일 숨김 */}
                      <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {article.mainCategory}
                          {article.subCategory && (
                            <span className="text-[var(--color-text-muted)]">
                              {' · '}
                              {article.subCategory}
                            </span>
                          )}
                        </span>
                      </td>
                      {/* 소스 — 모바일 숨김 */}
                      <td className="hidden md:table-cell px-4 py-3 text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                        {article.sourceName}
                      </td>
                      {/* 분류 방법 */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${methodBadgeClass(article.classificationMethod)}`}
                        >
                          {article.classificationMethod}
                        </span>
                      </td>
                      {/* 상태 */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusBadgeClass(article.status)}`}
                        >
                          {statusLabel(article.status)}
                        </span>
                      </td>
                      {/* 발행일 — 모바일 숨김 */}
                      <td className="hidden md:table-cell px-4 py-3 text-right text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                        {formatKST(article.publishedAt)}
                      </td>
                      {/* 숨김 컬럼 — 숨기기/공개 버튼 */}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end">
                          {(article.status === 'PUBLISHED' || article.status === 'HIDDEN') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVisibilityToggle(article)
                              }}
                              className="p-1.5 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                              aria-label={article.status === 'HIDDEN' ? '기사 공개' : '기사 숨기기'}
                              title={article.status === 'HIDDEN' ? '공개' : '숨기기'}
                            >
                              {article.status === 'HIDDEN' ? (
                                <Eye size={14} />
                              ) : (
                                <EyeOff size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      {/* 카드뉴스 컬럼 */}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCardNewsArticle({ id: article.id, title: article.title })
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors whitespace-nowrap"
                          title="카드뉴스 만들기"
                          aria-label="카드뉴스 만들기"
                        >
                          <LayoutTemplate size={12} />
                          카드뉴스
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 카드뉴스 모달 */}
      {cardNewsArticle && (
        <CardNewsModal
          articleId={cardNewsArticle.id}
          articleTitle={cardNewsArticle.title}
          onClose={() => setCardNewsArticle(null)}
        />
      )}

      {/* 페이지네이션 */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-[var(--color-text-muted)]">
            {(filter.page - 1) * filter.limit + 1}–{Math.min(filter.page * filter.limit, total)} /
            총 {total.toLocaleString()}건
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(filter.page - 1)}
              disabled={filter.page <= 1}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const page =
                totalPages <= 7
                  ? i + 1
                  : filter.page <= 4
                    ? i + 1
                    : filter.page >= totalPages - 3
                      ? totalPages - 6 + i
                      : filter.page - 3 + i
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={[
                    'min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors border',
                    filter.page === page
                      ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                  ].join(' ')}
                >
                  {page}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handlePageChange(filter.page + 1)}
              disabled={filter.page >= totalPages}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
