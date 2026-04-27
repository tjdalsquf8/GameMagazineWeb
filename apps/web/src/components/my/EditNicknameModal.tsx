// 닉네임 변경 모달 — 유효성 검사 포함 (2~20자, 한글/영문/숫자)
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useUpdateNickname } from '@/hooks/useMyMutations'
// validator 상수 — packages/shared에 package.json 없어 직접 참조
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,20}$/
const NICKNAME_MIN_LENGTH = 2
const NICKNAME_MAX_LENGTH = 20
const VALIDATION_MESSAGES = {
  NICKNAME_FORMAT: '닉네임은 한글/영문/숫자 2~20자여야 합니다',
} as const

interface EditNicknameModalProps {
  currentNickname: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newNickname: string) => void
}

/** 닉네임 변경 모달 컴포넌트 */
export default function EditNicknameModal({
  currentNickname,
  isOpen,
  onClose,
  onSuccess,
}: EditNicknameModalProps) {
  const [value, setValue] = useState(currentNickname)
  const [error, setError] = useState<string | null>(null)

  const { mutate, isLoading } = useUpdateNickname(() => {
    onSuccess?.(value)
    onClose()
  })

  /** 모달 열릴 때 초기화 */
  useEffect(() => {
    if (isOpen) {
      setValue(currentNickname)
      setError(null)
    }
  }, [isOpen, currentNickname])

  /** 실시간 유효성 검사 */
  const handleChange = (val: string) => {
    setValue(val)
    if (!val) {
      setError('닉네임을 입력해 주세요.')
    } else if (!NICKNAME_REGEX.test(val)) {
      setError(VALIDATION_MESSAGES.NICKNAME_FORMAT)
    } else {
      setError(null)
    }
  }

  /** 제출 처리 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!NICKNAME_REGEX.test(value)) {
      setError(VALIDATION_MESSAGES.NICKNAME_FORMAT)
      return
    }
    if (value === currentNickname) {
      setError('현재 닉네임과 동일합니다.')
      return
    }
    await mutate(value)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-nickname-title"
    >
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id="edit-nickname-title"
            className="text-base font-semibold text-[var(--color-text-primary)]"
          >
            닉네임 변경
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="모달 닫기"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="new-nickname"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              새 닉네임
            </label>
            <input
              id="new-nickname"
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              minLength={NICKNAME_MIN_LENGTH}
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder="닉네임을 입력해 주세요"
              className={[
                'w-full px-3 py-2 text-sm rounded-lg border bg-background text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors',
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-[var(--color-border)] focus:border-primary',
              ].join(' ')}
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              한글/영문/숫자 {NICKNAME_MIN_LENGTH}~{NICKNAME_MAX_LENGTH}자
            </p>
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
              type="submit"
              disabled={isLoading || !!error || !value}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              변경하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
