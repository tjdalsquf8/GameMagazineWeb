'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, setAccessTokenCookie } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function validateEmail(email: string): string | undefined {
  if (!email) return '이메일을 입력해주세요'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다'
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) return '비밀번호를 입력해주세요'
  return undefined
}

export default function LoginForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await login(email, password)
      if (res.success) {
        setAuth(res.data.user, res.data.accessToken)
        setAccessTokenCookie(res.data.accessToken)
        router.push('/')
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
    <div className="pt-2 pb-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-1">로그인</h1>
          <p className="text-sm text-text-muted">Game Magazine에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                비밀번호
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              placeholder="비밀번호를 입력하세요"
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-background text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.password ? 'border-red-400' : 'border-border focus:border-primary'
              }`}
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
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
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          아직 계정이 없으신가요?{' '}
          <Link href="/register" className="text-text-primary font-medium hover:underline">
            회원가입
          </Link>
        </p>
    </div>
  )
}
