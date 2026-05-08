// 어드민 대시보드 페이지 — 수집 지표·카테고리 그래프·소스 상태·로그·최근 기사 요약
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import {
  fetchAdminStats,
  fetchCategoryCollectionCounts,
  fetchPipelineLogs,
  fetchAdminSources,
  fetchAdminArticles,
  runPipelineNow,
  togglePipelinePause,
  toggleSourceActive,
  hideArticle,
  showArticle,
} from '@/lib/api/admin.api'
import type {
  AdminStats,
  CategoryCollectionCount,
  PipelineLog,
  AdminSource,
  AdminArticle,
  MainCategory,
} from '@/types/admin.types'
import { Play, PauseCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'

// ─── 유틸 ─────────────────────────────────────────────────────────

/** KST 형식으로 날짜 포맷 */
function formatKST(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 로그 상태별 배지 스타일 반환 */
function logStatusBadge(status: PipelineLog['status']): string {
  const map: Record<PipelineLog['status'], string> = {
    SUCCESS: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    WARNING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    FAILURE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    RUNNING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return map[status]
}

/** 로그 상태 한국어 라벨 */
function logStatusLabel(status: PipelineLog['status']): string {
  const map: Record<PipelineLog['status'], string> = {
    SUCCESS: '완료',
    WARNING: '경고',
    FAILURE: '실패',
    RUNNING: '실행중',
  }
  return map[status]
}

/** 기사 상태 배지 스타일 */
function articleStatusBadge(status: AdminArticle['status']): string {
  const map: Record<AdminArticle['status'], string> = {
    PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    HIDDEN: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return map[status] ?? ''
}

// ─── 상수 ─────────────────────────────────────────────────────────

/** 카테고리 대분류 정렬 순서 */
const CATEGORY_ORDER = ['PC', 'Console', 'Mobile', 'Esports', '기타']

/** 최근 발행 기사 카테고리 탭 목록 */
const ARTICLE_CATEGORY_TABS = ['ALL', 'PC', 'MOBILE', 'CONSOLE', 'ESPORTS', '기타'] as const

/** 탭 타입 — MainCategory 전체 + 기타 */
type ArticleCategoryTab = typeof ARTICLE_CATEGORY_TABS[number]

/** 탭 표시 라벨 */
const ARTICLE_CATEGORY_TAB_LABELS: Record<ArticleCategoryTab, string> = {
  ALL: '전체',
  PC: 'PC',
  MOBILE: 'Mobile',
  CONSOLE: 'Console',
  ESPORTS: 'Esports',
  기타: '기타',
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────

/** 대시보드 페이지 컴포넌트 */
export default function AdminDashboardPage() {
  const { showToast } = useToastStore()

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [categoryCounts, setCategoryCounts] = useState<CategoryCollectionCount[]>([])
  const [logs, setLogs] = useState<PipelineLog[]>([])
  const [sources, setSources] = useState<AdminSource[]>([])
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPipelineRunning, setIsPipelineRunning] = useState(false)
  const [articleCategory, setArticleCategory] = useState<ArticleCategoryTab>('ALL')
  const [isArticleLoading, setIsArticleLoading] = useState(false)

  /** 카테고리 탭별 기사 목록 로드 */
  const loadArticles = useCallback(async (cat: ArticleCategoryTab) => {
    setIsArticleLoading(true)
    try {
      const res = await fetchAdminArticles({
        mainCategory: cat === 'ALL' ? undefined : (cat as MainCategory),
        page: 1,
        limit: 10,
      })
      if (res.success) setArticles(res.data.data)
      else showToast('기사 목록을 불러오지 못했습니다.', 'error')
    } catch {
      showToast('기사 목록을 불러오지 못했습니다.', 'error')
    } finally {
      setIsArticleLoading(false)
    }
  }, [showToast])

  /** 초기 데이터 일괄 로드 */
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsRes, categoryRes, logsRes, sourcesRes] = await Promise.all([
        fetchAdminStats(),
        fetchCategoryCollectionCounts(),
        fetchPipelineLogs(1, 100),
        fetchAdminSources(),
      ])

      if (statsRes.success) setStats(statsRes.data)
      if (categoryRes.success) {
        const sorted = [...categoryRes.data].sort((a, b) => {
          const ai = CATEGORY_ORDER.indexOf(a.category)
          const bi = CATEGORY_ORDER.indexOf(b.category)
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
        })
        setCategoryCounts(sorted)
      }
      if (logsRes.success) setLogs(logsRes.data)
      if (sourcesRes.success) setSources(sourcesRes.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    loadArticles('ALL')
  }, [loadData, loadArticles])

  /** 파이프라인 즉시 실행 핸들러 */
  const handleRunNow = async () => {
    setIsPipelineRunning(true)
    const res = await runPipelineNow()
    if (res.success) {
      showToast(res.data.message, 'success')
    } else {
      showToast('실행 요청에 실패했습니다.', 'error')
    }
    setIsPipelineRunning(false)
  }

  /** 파이프라인 일시정지/재개 핸들러 */
  const handleTogglePause = async () => {
    if (!stats) return
    const nextPaused = !stats.isPipelinePaused
    const res = await togglePipelinePause(nextPaused)
    if (res.success) {
      setStats((prev) => (prev ? { ...prev, isPipelinePaused: nextPaused } : prev))
      showToast(res.data.message, 'success')
    } else {
      showToast('요청에 실패했습니다.', 'error')
    }
  }

  /** 소스 토글 핸들러 */
  const handleSourceToggle = async (id: string, current: boolean) => {
    const res = await toggleSourceActive(id, !current)
    if (res.success) {
      setSources((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !current } : s)))
    } else {
      showToast('소스 상태 변경에 실패했습니다.', 'error')
    }
  }

  /** 기사 숨기기/공개 핸들러 */
  const handleArticleVisibility = async (id: string, currentStatus: AdminArticle['status']) => {
    const isHidden = currentStatus === 'HIDDEN'
    const res = isHidden ? await showArticle(id) : await hideArticle(id)
    if (res.success) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: isHidden ? 'PUBLISHED' : 'HIDDEN' } : a))
      )
      showToast(res.data.message, 'success')
    } else {
      showToast('처리에 실패했습니다.', 'error')
    }
  }

  // 카테고리 막대 그래프 최대값
  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-[var(--color-text-muted)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">대시보드</h1>
          {stats && (
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              마지막 수집: {formatKST(stats.lastCollectedAt)} KST
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePause}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <PauseCircle size={15} />
            {stats?.isPipelinePaused ? '수집 재개' : '수집 일시정지'}
          </button>
          <button
            type="button"
            onClick={handleRunNow}
            disabled={isPipelineRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
          >
            <Play size={14} />
            {isPipelineRunning ? '실행 중...' : '지금 수집 실행'}
          </button>
        </div>
      </div>

      {/* 지표 카드 4개 */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="오늘 수집" value={`${stats.todayCollected}건`} color="text-blue-600" />
          <StatCard
            label="재작성 성공률"
            value={`${stats.rewriteSuccessRate}%`}
            color="text-green-600"
          />
          <StatCard
            label="이번 달 API 비용"
            value={`$${stats.monthlyApiCost}`}
            color="text-yellow-600"
          />
          <StatCard
            label="전체 기사"
            value={`${stats.totalArticles.toLocaleString()}건`}
            color="text-purple-600"
          />
        </div>
      )}

      {/* 중단 2열 — 카테고리 그래프 + 소스 상태 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카테고리별 수집량 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            카테고리별 수집량
          </h2>
          <div className="space-y-3">
            {categoryCounts.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm text-[var(--color-text-secondary)]">
                  {item.category}
                </span>
                <div className="flex-1 bg-[var(--color-surface)] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium text-[var(--color-text-primary)]">
                  {item.count}건
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 소스 상태 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">소스 상태</h2>
          <div className="space-y-2.5">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {source.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {source.lastCollectedAt ? formatKST(source.lastCollectedAt) : '수집 없음'}
                  </p>
                </div>
                {/* 토글 스위치 */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={source.isActive}
                  aria-label={`${source.name} ${source.isActive ? '비활성화' : '활성화'}`}
                  onClick={() => handleSourceToggle(source.id, source.isActive)}
                  className={[
                    'relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200',
                    source.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                      source.isActive ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 파이프라인 로그 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          파이프라인 실행 로그
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  상태
                </th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  내용
                </th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  저장
                </th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  스킵
                </th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  실패
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--color-text-muted)]">
                  실행시각
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--color-surface)] transition-colors">
                  <td className="py-2.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${logStatusBadge(log.status)}`}
                    >
                      {logStatusLabel(log.status)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-secondary)] max-w-[200px] truncate">
                    {log.message}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-[var(--color-text-secondary)]">
                    {log.saved}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-[var(--color-text-secondary)]">
                    {log.skipped}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-[var(--color-text-secondary)]">
                    {log.failed}
                  </td>
                  <td className="py-2.5 text-right text-[var(--color-text-muted)] whitespace-nowrap">
                    {formatKST(log.executedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 발행 기사 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">최근 발행 기사</h2>
          {/* 카테고리 탭 필터 */}
          <div className="flex flex-wrap gap-1.5">
            {ARTICLE_CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                disabled={isArticleLoading}
                onClick={() => {
                  setArticleCategory(tab)
                  loadArticles(tab)
                }}
                className={[
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  articleCategory === tab
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]',
                ].join(' ')}
              >
                {ARTICLE_CATEGORY_TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>
        <div className={['overflow-x-auto transition-opacity', isArticleLoading ? 'opacity-50' : ''].join(' ')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  제목
                </th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  카테고리
                </th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  상태
                </th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)]">
                  발행시각
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--color-text-muted)]">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className={[
                    'hover:bg-[var(--color-surface)] transition-colors',
                    article.status === 'FAILED' ? 'bg-red-50 dark:bg-red-950/20' : '',
                    article.status === 'HIDDEN' ? 'opacity-60' : '',
                  ].join(' ')}
                >
                  <td className="py-2.5 pr-4 max-w-[260px] truncate text-[var(--color-text-primary)]">
                    {article.title}
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-secondary)] whitespace-nowrap">
                    {article.mainCategory}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${articleStatusBadge(article.status)}`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right text-[var(--color-text-muted)] whitespace-nowrap">
                    {formatKST(article.publishedAt)}
                  </td>
                  <td className="py-2.5 text-right">
                    {(article.status === 'PUBLISHED' || article.status === 'HIDDEN') && (
                      <button
                        type="button"
                        onClick={() => handleArticleVisibility(article.id, article.status)}
                        className="p-1.5 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        aria-label={article.status === 'HIDDEN' ? '기사 공개' : '기사 숨기기'}
                        title={article.status === 'HIDDEN' ? '공개' : '숨기기'}
                      >
                        {article.status === 'HIDDEN' ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/** 지표 카드 컴포넌트 */
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-4">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
