'use client'

// 회원가입 Step 2: 이메일 인증 코드 입력 컴포넌트
// 인증 코드 5회 실패 시 5분 잠금 UX (카운트다운 + 입력 비활성화) 포함

import { useState, useEffect, useCallback } from 'react'
import { verifyCode, sendVerificationCode } from '@/lib/api/auth'

interface RegisterStep2Props {
  email: string
  onNext: () => void
  onBack: () => void
}

interface FormErrors {
  code?: string
  general?: string
}

/** 인증 코드 유효성 검사 */
function validateCode(value: string): string | undefined {
  if (!value) return '인증 코드를 입력해주세요'
  if (!/^\d{6}$/.test(value)) return '인증 코드는 6자리 숫자여야 합니다'
  return undefined
}

/** ms를 "N분 N초" 또는 "N초" 형식으로 변환 */
function formatMs(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return min > 0 ? `${min}분 ${sec}초` : `${sec}초`
}

const RESEND_COOLDOWN = 60
const LOCK_DURATION_MS = 5 * 60 * 1000 // 5분

export default function RegisterStep2({ email, onNext, onBack }: RegisterStep2Props) {
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [resendSuccess, setResendSuccess] = useState('')
  /** 잠금 남은 시간(ms). 0이면 잠금 해제 상태 */
  const [lockRemainingMs, setLockRemainingMs] = useState(0)

  /** 재발송 쿨다운 타이머 */
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  /** 잠금 카운트다운 타이머 (1초마다 1000ms 감소) */
  useEffect(() => {
    if (lockRemainingMs <= 0) return
    const timer = setInterval(() => {
      setLockRemainingMs((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [lockRemainingMs])

  /** 인증 코드 제출 처리 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const codeError = validateCode(code)
    if (codeError) {
      setErrors({ code: codeError })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const res = await verifyCode(email, code)
      if (res.success && res.data.verified) {
        onNext()
      } else if (!res.success && res.error.message.includes('잠겼습니다')) {
        // 5회 실패 잠금 감지: 5분 카운트다운 시작
        setLockRemainingMs(LOCK_DURATION_MS)
        setErrors({})
      } else {
        setErrors({ general: res.success ? '인증에 실패했습니다' : res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  /** 인증 코드 재발송 처리 */
  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    setResendSuccess('')
    setErrors({})

    try {
      const res = await sendVerificationCode(email)
      if (res.success) {
        setCooldown(RESEND_COOLDOWN)
        setResendSuccess('인증 코드가 재발송되었습니다')
        setCode('')
      } else {
        setErrors({ general: res.error.message })
      }
    } catch {
      setErrors({ general: '재발송에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setIsResending(false)
    }
  }, [cooldown, isResending, email])

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="rounded-lg bg-surface-hover border border-border px-3.5 py-3 text-sm text-text-secondary">
        <span className="font-medium text-text-primary">{email}</span> 으로 인증 코드를
        발송했습니다. 5분 이내에 입력해주세요.
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-text-secondary mb-1.5">
          인증 코드
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6)
            setCode(val)
            if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }))
          }}
          placeholder="6자리 숫자 입력"
          maxLength={6}
          disabled={isLoading || lockRemainingMs > 0}
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.code ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
        />
        {errors.code && <p className="mt-1.5 text-xs text-red-500">{errors.code}</p>}
      </div>

      {/* 잠금 안내 박스 (5회 실패 시 표시) */}
      {lockRemainingMs > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-3">
          <p className="text-sm text-amber-700 font-medium">인증 코드 5회 오류로 잠겼습니다.</p>
          <p className="text-sm text-amber-600 mt-0.5">
            {formatMs(lockRemainingMs)} 후 다시 인증을 시도해주세요.
          </p>
        </div>
      )}

      {/* 일반 오류 메시지 (잠금 상태가 아닐 때만 표시) */}
      {errors.general && lockRemainingMs === 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-3">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-3.5 py-3">
          <p className="text-sm text-green-600">{resendSuccess}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || lockRemainingMs > 0}
        className="w-full px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? '확인 중...' : '인증 확인'}
      </button>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          이전으로
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isResending || lockRemainingMs > 0}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? '발송 중...' : cooldown > 0 ? `재발송 (${cooldown}초)` : '재발송'}
        </button>
      </div>
    </form>
  )
}
