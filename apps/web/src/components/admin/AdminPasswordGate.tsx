// 어드민 페이지 진입 시 비밀번호 재확인 모달
// sessionStorage 기반으로 탭 세션 동안 인증 유지 (탭 닫으면 재인증 필요)
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Lock } from 'lucide-react'
import { verifyPassword } from '@/lib/api/auth'

/** sessionStorage 키 및 인증 유지 시간 (2시간) */
const SESSION_KEY = 'admin_auth_until'
const AUTH_DURATION_MS = 2 * 60 * 60 * 1000

interface AdminPasswordGateProps {
  /** 인증 성공 시 호출되는 콜백 */
  onVerified: () => void
}

/** 어드민 비밀번호 재확인 게이트 모달 */
export function AdminPasswordGate({ onVerified }: AdminPasswordGateProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /** 모달 마운트 시 비밀번호 input에 포커스 */
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  /** 취소 버튼 클릭 시 홈으로 이동 */
  const handleCancel = () => {
    router.replace('/')
  }

  /** 비밀번호 제출 처리 */
  const handleSubmit = async () => {
    if (isSubmitting) return
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await verifyPassword(password)
      if (!res.success) {
        setError('비밀번호 확인에 실패했습니다. 다시 시도해주세요')
        return
      }
      if (!res.data.verified) {
        setError('비밀번호가 올바르지 않습니다')
        return
      }
      // 인증 성공 — sessionStorage에 만료 시각 저장
      const expiresAt = Date.now() + AUTH_DURATION_MS
      sessionStorage.setItem(SESSION_KEY, String(expiresAt))
      onVerified()
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요')
    } finally {
      setIsSubmitting(false)
    }
  }

  /** 엔터키 제출 지원 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    // 전체 화면 오버레이 — 배경 클릭 차단
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-[var(--color-border)]">
        {/* 닫기 버튼 — 홈으로 이동 */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
          aria-label="취소하고 홈으로 이동"
        >
          <X size={18} />
        </button>

        {/* 모달 본문 */}
        <div className="px-8 py-8">
          {/* 아이콘 */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
              <Lock size={22} className="text-[var(--color-text-secondary)]" />
            </div>
          </div>

          {/* 제목 및 설명 */}
          <h2 className="text-lg font-semibold text-center text-[var(--color-text-primary)] mb-1">
            관리자 인증
          </h2>
          <p className="text-sm text-center text-[var(--color-text-muted)] mb-6">
            계속하려면 비밀번호를 입력해주세요
          </p>

          {/* 비밀번호 입력 */}
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호"
              disabled={isSubmitting}
              className={[
                'w-full px-4 py-2.5 rounded-lg text-sm',
                'bg-[var(--color-surface)] border',
                'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'transition-colors',
                error ? 'border-red-500' : 'border-[var(--color-border)]',
              ].join(' ')}
            />

            {/* 인라인 에러 메시지 */}
            {error && (
              <p className="text-xs text-red-500" role="alert">
                {error}
              </p>
            )}

            {/* 확인 버튼 */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={[
                'w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
                'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
                'hover:bg-[var(--color-primary-hover)]',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
              ].join(' ')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  확인 중...
                </>
              ) : (
                '확인'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** sessionStorage에서 어드민 인증 유효 여부를 확인하는 유틸 함수 */
export function isAdminSessionValid(): boolean {
  if (typeof window === 'undefined') return false
  const until = sessionStorage.getItem(SESSION_KEY)
  if (!until) return false
  return Date.now() < Number(until)
}
