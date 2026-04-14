'use client'

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

function validateCode(value: string): string | undefined {
  if (!value) return '인증 코드를 입력해주세요'
  if (!/^\d{6}$/.test(value)) return '인증 코드는 6자리 숫자여야 합니다'
  return undefined
}

const RESEND_COOLDOWN = 60

export default function RegisterStep2({ email, onNext, onBack }: RegisterStep2Props) {
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [resendSuccess, setResendSuccess] = useState('')

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
      } else {
        setErrors({ general: res.success ? '인증에 실패했습니다' : res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

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
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.code ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
        />
        {errors.code && <p className="mt-1.5 text-xs text-red-500">{errors.code}</p>}
      </div>

      {errors.general && (
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
        disabled={isLoading}
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
          disabled={cooldown > 0 || isResending}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? '발송 중...' : cooldown > 0 ? `재발송 (${cooldown}초)` : '재발송'}
        </button>
      </div>
    </form>
  )
}
