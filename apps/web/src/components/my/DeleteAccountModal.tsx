// 회원 탈퇴 확인 모달 — danger 스타일, 탈퇴 후 클리어 처리
'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useDeleteAccount } from '@/hooks/useMyMutations'
import { useAuthStore } from '@/store/authStore'
import { clearAccessTokenCookie } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

/** 회원 탈퇴 확인 모달 컴포넌트 */
export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  /** 탈퇴 완료 후 인증 상태 초기화 및 홈 이동 */
  const handleSuccess = () => {
    clearAccessTokenCookie()
    clearAuth()
    router.push('/')
  }

  const { mutate, isLoading } = useDeleteAccount(handleSuccess)

  const CONFIRM_KEYWORD = '탈퇴'
  const isConfirmed = confirmText === CONFIRM_KEYWORD

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2
              id="delete-account-title"
              className="text-base font-semibold text-[var(--color-text-primary)]"
            >
              회원 탈퇴
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
            aria-label="모달 닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 경고 메시지 */}
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
            탈퇴 시 모든 데이터(게시글, 댓글, 좋아요 등)가 <strong>영구적으로 삭제</strong>되며
            복구할 수 없습니다.
          </p>
        </div>

        {/* 탈퇴 확인 입력 */}
        <div className="mb-5">
          <label
            htmlFor="confirm-delete"
            className="block text-sm text-[var(--color-text-secondary)] mb-1.5"
          >
            확인을 위해{' '}
            <span className="font-semibold text-red-500">&quot;{CONFIRM_KEYWORD}&quot;</span>을
            입력해 주세요.
          </label>
          <input
            id="confirm-delete"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_KEYWORD}
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-background text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-red-400 transition-colors"
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isLoading || !isConfirmed}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  )
}
