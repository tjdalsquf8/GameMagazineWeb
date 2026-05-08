// 어드민 소스 관리 페이지 — RSS 소스(국내/Console/기타) + API 소스(Esports) 그룹핑
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import { fetchAdminSources, toggleSourceActive } from '@/lib/api/admin.api'
import type { AdminSource } from '@/types/admin.types'
import { ExternalLink, RefreshCw, Zap } from 'lucide-react'

// ─── 상수 ─────────────────────────────────────────────────────────

/** RSS 소스 그룹 정의 */
const RSS_GROUPS: {
  key: string
  label: string
  filter: (s: AdminSource) => boolean
}[] = [
  { key: 'domestic', label: '국내',    filter: (s) => s.language === 'KO' },
  { key: 'console',  label: 'Console', filter: (s) => s.platform === 'PlayStation' || s.platform === 'Xbox' || s.platform === 'Nintendo' },
  { key: 'etc',      label: '기타',    filter: (s) => s.language !== 'KO' && !s.platform },
]

/** 소스별 담당 카테고리 표시 (DB에 없는 메타 정보 — platform이 없는 소스용) */
const SOURCE_CATEGORIES: Record<string, string[]> = {
  '게임메카': ['PC', 'Mobile'],
}

/** API 소스 정의 (RSS가 아닌 직접 API 연동 소스) */
const API_SOURCES = [
  {
    key: 'lolesports',
    name: 'Lolesports API',
    description: 'LCK 경기 결과 자동 수집',
    category: 'Esports',
    endpoint: 'esports-api.lolesports.com',
    isActive: true,
  },
]

// ─── 유틸 ─────────────────────────────────────────────────────────

/** KST 날짜 포맷 */
function formatKST(iso: string | null): string {
  if (!iso) return '수집 기록 없음'
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 언어 뱃지 스타일 */
function langBadgeClass(lang: AdminSource['language']): string {
  return lang === 'KO'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────

/** 소스 관리 페이지 컴포넌트 */
export default function AdminSourcesPage() {
  const { showToast } = useToastStore()

  const [sources, setSources] = useState<AdminSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  /** 소스 목록 로드 */
  const loadSources = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetchAdminSources()
      if (res.success) setSources(res.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSources()
  }, [loadSources])

  /** 소스 활성화 토글 핸들러 */
  const handleToggle = async (source: AdminSource) => {
    setTogglingId(source.id)
    const res = await toggleSourceActive(source.id, !source.isActive)
    if (res.success) {
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, isActive: !source.isActive } : s))
      )
      showToast(
        source.isActive ? `${source.name} 비활성화되었습니다.` : `${source.name} 활성화되었습니다.`,
        'success'
      )
    } else {
      showToast('소스 상태 변경에 실패했습니다.', 'error')
    }
    setTogglingId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-[var(--color-text-muted)]" />
      </div>
    )
  }

  const visibleRssGroups = RSS_GROUPS.map((g) => ({
    ...g,
    items: sources.filter(g.filter),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">소스 관리</h1>
        <button
          type="button"
          onClick={loadSources}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <RefreshCw size={14} />
          새로고침
        </button>
      </div>

      {/* ── RSS 소스 ── */}
      <div className="space-y-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
          RSS 소스
        </h2>
        {sources.length === 0 && (
          <div className="flex items-center justify-center h-24 text-[var(--color-text-muted)] text-sm">
            등록된 소스가 없습니다.
          </div>
        )}
        {visibleRssGroups.map((group) => (
          <section key={group.key} className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
              {group.label}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                ({group.items.length})
              </span>
            </h3>
            {/* Console은 가로 한 줄로, 나머지는 그리드 */}
            <div className={group.key === 'console'
              ? 'flex flex-wrap gap-4'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            }>
              {group.items.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  isToggling={togglingId === source.id}
                  onToggle={handleToggle}
                  compact={group.key === 'console'}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── API 소스 ── */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
          API 소스
        </h2>
        <div className="flex flex-wrap gap-4">
          {API_SOURCES.map((src) => (
            <div
              key={src.key}
              className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] px-5 py-4 min-w-[280px]"
            >
              <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{src.name}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {src.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{src.description}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{src.endpoint}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                ON
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 소스 카드 컴포넌트 */
function SourceCard({
  source,
  isToggling,
  onToggle,
  compact = false,
}: {
  source: AdminSource
  isToggling: boolean
  onToggle: (source: AdminSource) => void
  compact?: boolean
}) {
  return (
    <div
      className={[
        'bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] transition-opacity',
        compact ? 'p-4 min-w-[240px]' : 'p-5',
        !source.isActive ? 'opacity-70' : '',
      ].join(' ')}
    >
      {/* 카드 상단 — 소스명 + 언어뱃지 + 토글 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {source.name}
            </h3>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${langBadgeClass(source.language)}`}
            >
              {source.language}
            </span>
          </div>
          {/* 담당 카테고리 태그 — platform 있으면 platform, 없으면 SOURCE_CATEGORIES 폴백 */}
          {(source.platform || SOURCE_CATEGORIES[source.name]) && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {(source.platform ? [source.platform] : SOURCE_CATEGORIES[source.name]).map((cat) => (
                <span
                  key={cat}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          {/* URL */}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 mt-0.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors truncate max-w-[200px]"
          >
            <ExternalLink size={10} className="shrink-0" />
            <span className="truncate">{source.url}</span>
          </a>
        </div>

        {/* 토글 스위치 */}
        <button
          type="button"
          role="switch"
          aria-checked={source.isActive}
          aria-label={`${source.name} ${source.isActive ? '비활성화' : '활성화'}`}
          onClick={() => onToggle(source)}
          disabled={isToggling}
          className={[
            'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
            source.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
            isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span
            className={[
              'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
              source.isActive ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[var(--color-border)] my-3" />

      {/* 수집 정보 */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">마지막 수집</span>
          <span className="text-[var(--color-text-secondary)]">
            {formatKST(source.lastCollectedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">전체 수집 건수</span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {source.totalCollected.toLocaleString()}건
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">상태</span>
          <span
            className={[
              'flex items-center gap-1 font-medium',
              source.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400',
            ].join(' ')}
          >
            <span
              className={[
                'w-1.5 h-1.5 rounded-full',
                source.isActive ? 'bg-green-500' : 'bg-gray-400',
              ].join(' ')}
            />
            {source.isActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  )
}
