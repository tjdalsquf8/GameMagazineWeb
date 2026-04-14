'use client'

import { useState } from 'react'
import { sendVerificationCode } from '@/lib/api/auth'

interface RegisterStep1Props {
  onNext: (email: string, nickname: string) => void
}

interface FormErrors {
  nickname?: string
  email?: string
  general?: string
}

function validateNickname(value: string): string | undefined {
  if (!value) return '닉네임을 입력해주세요'
  if (!/^[가-힣a-zA-Z0-9]{2,20}$/.test(value))
    return '닉네임은 한글, 영문, 숫자 조합으로 2~20자여야 합니다'
  return undefined
}

function validateEmail(value: string): string | undefined {
  if (!value) return '이메일을 입력해주세요'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식이 아닙니다'
  return undefined
}

export default function RegisterStep1({ onNext }: RegisterStep1Props) {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const nicknameError = validateNickname(nickname)
    const emailError = validateEmail(email)
    if (nicknameError) newErrors.nickname = nicknameError
    if (emailError) newErrors.email = emailError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await sendVerificationCode(email)
      if (res.success) {
        onNext(email, nickname)
      } else {
        setErrors({ general: res.error.message })
      }
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-text-secondary mb-1.5">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            if (errors.nickname) setErrors((prev) => ({ ...prev, nickname: undefined }))
          }}
          placeholder="2~20자, 한글/영문/숫자"
          maxLength={20}
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.nickname ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
        />
        {errors.nickname && <p className="mt-1.5 text-xs text-red-500">{errors.nickname}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
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
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.email ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
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
        {isLoading ? '인증 코드 발송 중...' : '인증 코드 발송'}
      </button>
    </form>
  )
}
