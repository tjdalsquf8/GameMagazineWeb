// 어드민 신고 관리 페이지
// 신고 목록 조회, 상태 필터, 처리(승인/기각) 기능, 페이지네이션
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import { fetchAdminReports, resolveReport } from '@/lib/api/admin.api'
import type { AdminReport, ReportStatus } from '@/types/admin.types'
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'

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

/** 신고 관리 페이지 컴포넌트 */
export default function AdminCommunityReportsPage() {
  const { showToast } = useToastStore()
  const [reports, setReports] = useState<AdminReport[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  /** 신고 처리 (승인 또는 기각) */
  async function handleResolve(id: string, action: 'RESOLVED' | 'DISMISSED') {
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

  /** 대기 중인 신고 수 */
  const pendingCount = reports.filter((r) => r.status === 'PENDING').length

  return (
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
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-16">
                    대상
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">
                    내용 미리보기
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
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-36">
                    신고 일시
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-text-muted)] w-24">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[var(--color-surface)] transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-block px-2 py-0.5 text-xs rounded-full font-medium',
                          report.targetType === 'POST'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                        ].join(' ')}
                      >
                        {report.targetType === 'POST' ? '게시글' : '댓글'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)] max-w-xs truncate">
                      {report.targetPreview}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {report.reporterNickname}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{report.reason}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={[
                          'inline-block px-2 py-0.5 text-xs rounded-full',
                          STATUS_BADGE[report.status].className,
                        ].join(' ')}
                      >
                        {STATUS_BADGE[report.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === 'PENDING' ? (
                        <div className="flex justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleResolve(report.id, 'RESOLVED')}
                            disabled={actionLoading === report.id}
                            title="처리 완료"
                            className="p-1.5 rounded-md text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResolve(report.id, 'DISMISSED')}
                            disabled={actionLoading === report.id}
                            title="기각"
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={15} />
                          </button>
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
  )
}
