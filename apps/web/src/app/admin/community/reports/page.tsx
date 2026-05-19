// 어드민 신고 관리 페이지
// 신고 목록 조회, 상태 필터, 콘텐츠 처리(숨김/기각), 유저 정지(7일/30일/영구), 페이지네이션
'use client'

import { useEffect, useState, useCallback } from 'react'
import { XCircle, ChevronLeft, ChevronRight, EyeOff, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { fetchAdminReports, resolveReport, banUser } from '@/lib/api/admin.api'
import type { AdminReport, ReportStatus, BanDuration } from '@/types/admin.types'

/** 신고 상세 모달 — 내용 전문 및 신고 사유 전문 표시 */
function ReportDetailModal({
  report,
  onClose,
}: {
  report: AdminReport
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">신고 상세</h2>
          <button type="button" onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">대상</p>
            <span className={[
              'inline-block px-2 py-0.5 text-xs rounded-full font-medium',
              report.targetType === 'POST'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-purple-100 text-purple-600',
            ].join(' ')}>
              {report.targetType === 'POST' ? '게시글' : '댓글'}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">내용</p>
            <p className="text-[var(--color-text-primary)] whitespace-pre-wrap break-all bg-[var(--color-surface)] rounded p-3 max-h-40 overflow-y-auto">
              {report.targetPreview}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">신고 사유</p>
            <p className="text-[var(--color-text-primary)] whitespace-pre-wrap break-all bg-[var(--color-surface)] rounded p-3 max-h-40 overflow-y-auto">
              {report.reason}
            </p>
          </div>
          {report.targetAuthorNickname && (
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">피신고자</p>
              <p className="text-[var(--color-text-primary)]">{report.targetAuthorNickname}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

/** 페이지당 신고 수 */
const PAGE_LIMIT = 20

/** 신고 상태 필터 옵션 */
const STATUS_FILTER_OPTIONS: { key: ReportStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '처리 대기' },
  { key: 'RESOLVED', label: '처리 완료' },
  { key: 'DISMISSED', label: '기각' },
]

/** 신고 상태 배지 스타일 */
const STATUS_BADGE: Record<ReportStatus, { label: string; className: string }> = {
  PENDING: {
    label: '대기',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  RESOLVED: {
    label: '처리됨',
    className: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  DISMISSED: {
    label: '기각',
    className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  },
}

/** 정지 버튼 옵션 정의 */
const BAN_OPTIONS: {
  duration: BanDuration
  label: string
  className: string
}[] = [
  {
    duration: '7d',
    label: '7일 정지',
    className:
      'px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 disabled:opacity-50 transition-colors',
  },
  {
    duration: '30d',
    label: '30일 정지',
    className:
      'px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 disabled:opacity-50 transition-colors',
  },
  {
    duration: 'permanent',
    label: '영구 정지',
    className:
      'px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors',
  },
]

/** 정지 이력 뱃지 렌더링 — 횟수가 0이면 null 반환 */
function BanHistoryBadge({
  duration,
  count,
}: {
  duration: BanDuration
  count: number
}) {
  if (count === 0) return null

  const configs: Record<BanDuration, { label: string; className: string }> = {
    '7d': {
      label: `7일 ×${count}회`,
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    '30d': {
      label: `30일 ×${count}회`,
      className:
        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
    permanent: {
      label: `영구 ×${count}회`,
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  }

  const { label, className } = configs[duration]
  return (
    <span className={`inline-block px-1.5 py-0.5 text-xs rounded font-medium ${className}`}>
      {label}
    </span>
  )
}

/** 신고 관리 페이지 컴포넌트 */
export default function AdminCommunityReportsPage() {
  const { showToast } = useToastStore()
  const [reports, setReports] = useState<AdminReport[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL')
  /** 콘텐츠 처리(숨김/기각) 로딩 중인 신고 ID */
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  /** 정지 처리 로딩 중인 신고 ID */
  const [banLoadingId, setBanLoadingId] = useState<string | null>(null)
  /** 상세 모달에 표시할 신고 */
  const [detailReport, setDetailReport] = useState<AdminReport | null>(null)

  /** 전체 페이지 수 */
  const totalPages = Math.ceil(total / PAGE_LIMIT)

  /** 신고 목록 불러오기 */
  const loadReports = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchAdminReports(statusFilter, page, PAGE_LIMIT)
    if (res.success) {
      setReports(res.data.reports)
      setTotal(res.data.total)
    }
    setIsLoading(false)
  }, [statusFilter, page])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  /** 상태 필터 변경 시 page=1로 초기화 */
  function handleStatusFilterChange(key: ReportStatus | 'ALL') {
    setStatusFilter(key)
    setPage(1)
  }

  /** 페이지 변경 */
  function handlePageChange(next: number) {
    if (next < 1 || next > totalPages) return
    setPage(next)
  }

  /** 콘텐츠 처리 — RESOLVED(숨김처리) 또는 DISMISSED(기각) */
  async function handleResolve(id: string, action: 'RESOLVED' | 'DISMISSED') {
    if (actionLoading === id) return
    setActionLoading(id)
    const res = await resolveReport(id, action)
    if (res.success) {
      showToast(res.data.message, 'success')
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)))
    } else {
      showToast('처리에 실패했습니다.', 'error')
    }
    setActionLoading(null)
  }

  /** 유저 정지 — confirm 다이얼로그 후 banUser API 호출 */
  async function handleBan(report: AdminReport, duration: BanDuration) {
    if (!report.targetAuthorId || !report.targetAuthorNickname) return
    if (banLoadingId === report.id) return

    const durationLabel =
      duration === '7d' ? '7일' : duration === '30d' ? '30일' : '영구'
    const confirmed = window.confirm(
      `${report.targetAuthorNickname}님을 ${durationLabel} 정지하시겠습니까?`
    )
    if (!confirmed) return

    setBanLoadingId(report.id)
    try {
      const res = await banUser(
        report.targetAuthorId,
        duration,
        `신고 ID: ${report.id} — ${report.reason}`
      )
      if (!res.success) throw new Error(res.error.message)
      showToast(`${durationLabel} 정지 처리되었습니다.`, 'success')
    } catch {
      showToast('정지 처리에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setBanLoadingId(null)
    }
  }

  /** 대기 중인 신고 수 */
  const pendingCount = reports.filter((r) => r.status === 'PENDING').length

  return (
    <>
    {detailReport && (
      <ReportDetailModal report={detailReport} onClose={() => setDetailReport(null)} />
    )}
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">신고 관리</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            커뮤니티 신고를 검토하고 처리합니다.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
            {pendingCount}건 대기
          </span>
        )}
      </div>

      {/* 상태 필터 */}
      <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden text-sm w-fit">
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => handleStatusFilterChange(opt.key)}
            className={[
              'px-3 py-1.5 transition-colors',
              statusFilter === opt.key
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white dark:bg-gray-900 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">로딩 중...</div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
            신고가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-20">
                    대상
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">
                    내용 미리보기
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-36">
                    피신고자 / 정지이력
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-24">
                    신고자
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-28">
                    사유
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-text-muted)] w-20">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-28">
                    신고 일시
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-72">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[var(--color-surface)] transition-colors">
                    {/* 대상 타입 */}
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-block px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap',
                          report.targetType === 'POST'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                        ].join(' ')}
                      >
                        {report.targetType === 'POST' ? '게시글' : '댓글'}
                      </span>
                    </td>

                    {/* 내용 미리보기 — 1줄 truncate, 클릭 시 상세 모달 */}
                    <td className="px-4 py-3 max-w-xs">
                      <button
                        type="button"
                        onClick={() => setDetailReport(report)}
                        className="w-full text-left text-[var(--color-text-primary)] truncate block hover:text-[var(--color-primary)] transition-colors"
                        title="클릭하여 상세 보기"
                      >
                        {report.targetPreview}
                      </button>
                    </td>

                    {/* 피신고자 / 정지이력 */}
                    <td className="px-4 py-3">
                      {report.targetAuthorNickname ? (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-[var(--color-text-primary)]">
                            {report.targetAuthorNickname}
                          </p>
                          {report.banHistory ? (
                            <div className="flex flex-wrap gap-1">
                              <BanHistoryBadge duration="7d" count={report.banHistory['7d']} />
                              <BanHistoryBadge duration="30d" count={report.banHistory['30d']} />
                              <BanHistoryBadge
                                duration="permanent"
                                count={report.banHistory.permanent}
                              />
                              {report.banHistory['7d'] === 0 &&
                                report.banHistory['30d'] === 0 &&
                                report.banHistory.permanent === 0 && (
                                  <span className="text-xs text-[var(--color-text-muted)]">—</span>
                                )}
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--color-text-muted)]">—</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-text-muted)]">—</span>
                      )}
                    </td>

                    {/* 신고자 */}
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {report.reporterNickname}
                    </td>

                    {/* 사유 — 1줄 truncate, 클릭 시 상세 모달 */}
                    <td className="px-4 py-3 max-w-[7rem]">
                      <button
                        type="button"
                        onClick={() => setDetailReport(report)}
                        className="w-full text-left text-[var(--color-text-muted)] truncate block hover:text-[var(--color-primary)] transition-colors"
                        title="클릭하여 상세 보기"
                      >
                        {report.reason}
                      </button>
                    </td>

                    {/* 상태 배지 */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={[
                          'inline-block px-2 py-0.5 text-xs rounded-full whitespace-nowrap',
                          STATUS_BADGE[report.status].className,
                        ].join(' ')}
                      >
                        {STATUS_BADGE[report.status].label}
                      </span>
                    </td>

                    {/* 신고 일시 */}
                    <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* 작업 버튼 — 콘텐츠처리·정지 모두 한 줄 가로 나열 */}
                    <td className="px-4 py-3">
                      {report.status === 'PENDING' ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleResolve(report.id, 'RESOLVED')}
                            disabled={actionLoading === report.id}
                            title="숨김처리"
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            <EyeOff size={12} />
                            숨김
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResolve(report.id, 'DISMISSED')}
                            disabled={actionLoading === report.id}
                            title="기각"
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            <XCircle size={12} />
                            기각
                          </button>
                          <span className="text-[var(--color-border)]">|</span>
                          {BAN_OPTIONS.map((opt) => (
                            <button
                              key={opt.duration}
                              type="button"
                              onClick={() => handleBan(report, opt.duration)}
                              disabled={!report.targetAuthorId || banLoadingId === report.id}
                              title={!report.targetAuthorId ? '피신고자 정보 없음' : opt.label}
                              className={opt.className + ' whitespace-nowrap'}
                            >
                              {banLoadingId === report.id ? '...' : opt.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="block text-center text-xs text-[var(--color-text-muted)]">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-[var(--color-text-muted)]">
            {(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)} / 총{' '}
            {total.toLocaleString()}건
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p =
                totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= totalPages - 3
                      ? totalPages - 6 + i
                      : page - 3 + i
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={[
                    'min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors border',
                    page === p
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                  ].join(' ')}
                >
                  {p}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
