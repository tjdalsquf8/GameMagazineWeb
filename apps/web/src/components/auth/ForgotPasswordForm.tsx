'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { forgotPassword, verifyResetToken, resetPassword } from '@/lib/api/auth'

type Step = 1 | 2 | 3 | 4

interface FormErrors {
  name?: string
  email?: string
  token?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

function validateName(value: string): string | undefined {
  if (!value.trim()) return '이름을 입력해주세요'
  if (value.trim().length < 2) return '이름은 2자 이상이어야 합니다'
  return undefined
}

function validateEmail(value: string): string | undefined {
  if (!value) return '이메일을 입력해주세요'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식이 아닙니다'
  return undefined
}

function validateToken(value: string): string | undefined {
  if (!value) return '인증 코드를 입력해주세요'
  if (!/^\d{6}$/.test(value)) return '인증 코드는 6자리 숫자여야 합니다'
  return undefined
}

function validateNewPassword(value: string): string | undefined {
  if (!value) return '새 비밀번호를 입력해주세요'
  if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다'
  if (value.length > 50) return '비밀번호는 50자 이하여야 합니다'
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) return '비밀번호는 영문과 숫자를 포함해야 합니다'
  return undefined
}

function validateConfirmPassword(newPassword: string, confirm: string): string | undefined {
  if (!confirm) return '비밀번호 확인을 입력해주세요'
  if (newPassword !== confirm) return '비밀번호가 일치하지 않습니다'
  return undefined
}

export default function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleStep1Submit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const res = await forgotPassword(name.trim(), email)
      if (res.success) {
        setStep(2)
      } else {
        setErrors({ general: res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e: FormEvent) => {
    e.preventDefault()
    const tokenError = validateToken(token)
    if (tokenError) {
      setErrors({ token: tokenError })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const res = await verifyResetToken(email, token)
      if (res.success) {
        setResetToken(res.data.resetToken)
        setStep(3)
      } else {
        setErrors({ general: res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep3Submit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    const newPasswordError = validateNewPassword(newPassword)
    const confirmError = validateConfirmPassword(newPassword, confirmPassword)
    if (newPasswordError) newErrors.newPassword = newPasswordError
    if (confirmError) newErrors.confirmPassword = confirmError
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const res = await resetPassword(resetToken, newPassword)
      if (res.success) {
        setStep(4)
      } else {
        setErrors({ general: res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      hasError ? 'border-red-400' : 'border-border focus:border-primary'
    }`

  const stepLabels: Record<Step, string> = {
    1: '정보 입력',
    2: '코드 확인',
    3: '새 비밀번호',
    4: '완료',
  }

  return (
    <div className="w-full max-w-md">
      <div className="pt-2 pb-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-1">비밀번호 찾기</h1>
          <p className="text-sm text-text-muted">
            {step === 1 && '가입 시 입력한 이름과 이메일을 입력해주세요'}
            {step === 2 && `${email}로 발송된 6자리 코드를 입력해주세요`}
            {step === 3 && '새 비밀번호를 설정해주세요'}
            {step === 4 && '비밀번호가 성공적으로 변경되었습니다'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  s === step
                    ? 'bg-primary text-primary-foreground'
                    : s < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-border text-text-muted'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-8 h-0.5 transition-colors ${s < step ? 'bg-primary/40' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mb-6">{stepLabels[step]}</p>

        {/* Step 1: 이름 + 이메일 */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                이름 (닉네임)
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                placeholder="가입 시 사용한 닉네임"
                className={inputClass(!!errors.name)}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="example@email.com"
                className={inputClass(!!errors.email)}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            {errors.general && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? '이메일 발송 중...' : '인증 이메일 발송'}
            </button>
          </form>
        )}

        {/* Step 2: 인증 코드 입력 */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                인증 코드
              </label>
              <input
                id="token"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setToken(value)
                  if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }))
                }}
                placeholder="6자리 숫자 입력"
                className={inputClass(!!errors.token)}
              />
              {errors.token && <p className="mt-1.5 text-xs text-red-500">{errors.token}</p>}
            </div>

            {errors.general && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? '확인 중...' : '인증 확인'}
            </button>

            <button
              type="button"
              onClick={() => {
                setToken('')
                setErrors({})
                setStep(1)
              }}
              className="w-full px-4 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              이전 단계로
            </button>
          </form>
        )}

        {/* Step 3: 새 비밀번호 설정 */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }))
                }}
                placeholder="영문 + 숫자 8자 이상"
                className={inputClass(!!errors.newPassword)}
              />
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-secondary mb-1.5"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                }}
                placeholder="비밀번호를 다시 입력하세요"
                className={inputClass(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.general && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}

        {/* Step 4: 완료 */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm">
                비밀번호가 성공적으로 변경되었습니다.
                <br />새 비밀번호로 로그인해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors hover:bg-primary-hover"
            >
              로그인으로 이동
            </button>
          </div>
        )}

        {/* 하단 링크 */}
        {(step === 1 || step === 2) && (
          <p className="mt-6 text-center text-sm text-text-muted">
            계정이 기억나셨나요?{' '}
            <Link href="/login" className="text-text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
