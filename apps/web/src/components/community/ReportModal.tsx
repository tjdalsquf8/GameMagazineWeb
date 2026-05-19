'use client'

// ReportModal.tsx
// 게시글/댓글 신고 모달 컴포넌트
// 신고 사유 입력 후 API 호출, 중복 신고 및 로딩 상태 처리

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  /** 신고 API 호출 함수 — 외부에서 주입해 게시글/댓글 모두 재사용 */
  onSubmit: (reason: string) => Promise<void>
  title?: string
}

/** 신고하기 모달 — 사유 입력 후 onSubmit 호출 */
export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  title = '신고하기',
}: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /** 모달 열릴 때 textarea 포커스 및 상태 초기화 */
  useEffect(() => {
    if (isOpen) {
      setReason('')
      setIsSubmitting(false)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [isOpen])

  /** ESC 키로 모달 닫기 */
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  /** 신고 접수 버튼 클릭 — 중복 제출 방지 */
  const handleSubmit = async () => {
    if (isSubmitting) return
    const trimmed = reason.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    try {
      await onSubmit(trimmed)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => { if (!isSubmitting) onClose() }}
      />

      {/* 모달 패널 */}
      <div className="relative w-full max-w-md bg-surface rounded-lg shadow-xl border border-border">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2
            id="report-modal-title"
            className="text-base font-semibold text-text-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-5 py-4">
          <label
            htmlFor="report-reason"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            신고 사유
          </label>
          <textarea
            id="report-reason"
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
            rows={4}
            placeholder="신고 사유를 입력해주세요"
            disabled={isSubmitting}
            className="w-full text-sm text-text-primary bg-background border border-border rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-text-muted">{reason.length} / 200</span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-5 pb-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm border border-border rounded text-text-secondary hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || reason.trim().length === 0}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '접수 중...' : '신고 접수'}
          </button>
        </div>
      </div>
    </div>
  )
}
