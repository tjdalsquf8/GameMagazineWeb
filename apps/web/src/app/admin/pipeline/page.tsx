// 어드민 파이프라인 페이지 — 파이프라인 상태·스케줄·실행 제어·로그 테이블
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import {
  fetchPipelineStatus,
  fetchPipelineLogs,
  runPipelineNow,
  togglePipelinePause,
} from '@/lib/api/admin.api'
import type { PipelineLog, PipelineStatus } from '@/types/admin.types'
import {
  Play,
  PauseCircle,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader,
} from 'lucide-react'

// ─── 유틸 ─────────────────────────────────────────────────────────

/** KST 형식 날짜 포맷 */
function formatKST(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 로그 상태별 아이콘 반환 */
function StatusIcon({ status }: { status: PipelineLog['status'] }) {
  const props = { size: 14 }
  switch (status) {
    case 'SUCCESS':
      return <CheckCircle {...props} className="text-green-500" />
    case 'WARNING':
      return <AlertTriangle {...props} className="text-yellow-500" />
    case 'FAILURE':
      return <XCircle {...props} className="text-red-500" />
    case 'RUNNING':
      return <Loader {...props} className="text-blue-500 animate-spin" />
  }
}

/** 로그 상태 한국어 라벨 */
function statusLabel(status: PipelineLog['status']): string {
  const map: Record<PipelineLog['status'], string> = {
    SUCCESS: '완료',
    WARNING: '경고',
    FAILURE: '실패',
    RUNNING: '실행중',
  }
  return map[status]
}

/** 로그 상태 행 배경색 */
function rowBg(status: PipelineLog['status']): string {
  if (status === 'FAILURE') return 'bg-red-50 dark:bg-red-950/20'
  if (status === 'WARNING') return 'bg-yellow-50 dark:bg-yellow-950/20'
  return ''
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────

/** 파이프라인 페이지 컴포넌트 */
export default function AdminPipelinePage() {
  const { showToast } = useToastStore()

  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null)
  const [logs, setLogs] = useState<PipelineLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)

  /** 데이터 로드 */
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetchPipelineStatus(),
        fetchPipelineLogs(1, 50),
      ])
      if (statusRes.success) setPipelineStatus(statusRes.data)
      if (logsRes.success) setLogs(logsRes.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  /** 파이프라인 즉시 실행 */
  const handleRunNow = async () => {
    setIsActionLoading(true)
    const res = await runPipelineNow()
    if (res.success) {
      showToast(res.data.message, 'success')
      // 실행 후 상태 갱신
      const statusRes = await fetchPipelineStatus()
      if (statusRes.success) setPipelineStatus(statusRes.data)
    } else {
      showToast('실행 요청에 실패했습니다.', 'error')
    }
    setIsActionLoading(false)
  }

  /** 파이프라인 일시정지/재개 */
  const handleTogglePause = async () => {
    if (!pipelineStatus) return
    setIsActionLoading(true)
    const nextPaused = !pipelineStatus.isPaused
    const res = await togglePipelinePause(nextPaused)
    if (res.success) {
      setPipelineStatus((prev) => (prev ? { ...prev, isPaused: nextPaused } : prev))
      showToast(res.data.message, 'success')
    } else {
      showToast('요청에 실패했습니다.', 'error')
    }
    setIsActionLoading(false)
  }

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
      <h1 className="text-xl font-bold text-[var(--color-text-primary)]">파이프라인</h1>

      {/* 현재 상태 카드 */}
      {pipelineStatus && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* 상태 정보 */}
            <div className="space-y-3">
              {/* 현재 상태 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-muted)]">현재 상태</span>
                <span
                  className={[
                    'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                    pipelineStatus.isPaused
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : pipelineStatus.isRunning
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'w-1.5 h-1.5 rounded-full',
                      pipelineStatus.isPaused
                        ? 'bg-yellow-500'
                        : pipelineStatus.isRunning
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-green-500',
                    ].join(' ')}
                  />
                  {pipelineStatus.isPaused
                    ? '일시정지'
                    : pipelineStatus.isRunning
                      ? '실행중'
                      : '대기중'}
                </span>
              </div>

              {/* 스케줄 */}
              <div>
                <p className="text-sm text-[var(--color-text-muted)] mb-1">자동 실행 스케줄</p>
                <div className="flex flex-wrap gap-1.5">
                  {pipelineStatus.schedules.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 마지막 실행 / 다음 실행 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">마지막 실행</p>
                  <p className="text-[var(--color-text-secondary)] mt-0.5">
                    {formatKST(pipelineStatus.lastRunAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">다음 실행 예정</p>
                  <p className="text-[var(--color-text-secondary)] mt-0.5">
                    {formatKST(pipelineStatus.nextRunAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 제어 버튼 */}
            <div className="flex sm:flex-col gap-2">
              <button
                type="button"
                onClick={handleRunNow}
                disabled={isActionLoading || pipelineStatus.isRunning}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                <Play size={14} />
                지금 실행
              </button>
              <button
                type="button"
                onClick={handleTogglePause}
                disabled={isActionLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
              >
                <PauseCircle size={14} />
                {pipelineStatus.isPaused ? '재개' : '일시정지'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 실행 로그 테이블 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">실행 로그</h2>
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <RefreshCw size={12} />
            새로고침
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
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
                <th className="text-right py-2 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                  실행시각
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--color-text-muted)]">
                    실행 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-[var(--color-surface)] transition-colors ${rowBg(log.status)}`}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={log.status} />
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {statusLabel(log.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-[var(--color-text-secondary)] max-w-[240px] truncate">
                      {log.message}
                    </td>
                    <td className="py-3 pr-4 text-right text-[var(--color-text-secondary)]">
                      {log.saved}
                    </td>
                    <td className="py-3 pr-4 text-right text-[var(--color-text-secondary)]">
                      {log.skipped}
                    </td>
                    <td className="py-3 pr-4 text-right text-[var(--color-text-secondary)]">
                      {log.failed}
                    </td>
                    <td className="py-3 text-right text-[var(--color-text-muted)] whitespace-nowrap">
                      {formatKST(log.executedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
