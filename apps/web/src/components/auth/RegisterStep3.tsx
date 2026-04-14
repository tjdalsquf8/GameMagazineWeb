'use client'

import { useState } from 'react'
import { register } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

interface RegisterStep3Props {
  email: string
  nickname: string
  onBack: () => void
}

interface FormErrors {
  password?: string
  confirmPassword?: string
  general?: string
}

function validatePassword(value: string): string | undefined {
  if (!value) return '비밀번호를 입력해주세요'
  if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다'
  if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(value)) return '비밀번호는 영문과 숫자를 포함해야 합니다'
  return undefined
}

export default function RegisterStep3({ email, nickname, onBack }: RegisterStep3Props) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await register(email, nickname, password)
      if (res.success) {
        router.push('/login?registered=true')
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
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          placeholder="8자 이상, 영문+숫자 조합"
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.password ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
        />
        {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
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
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors.confirmPassword ? 'border-red-400' : 'border-border focus:border-primary'
          }`}
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
        {isLoading ? '가입 중...' : '회원가입 완료'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        이전으로
      </button>
    </form>
  )
}
