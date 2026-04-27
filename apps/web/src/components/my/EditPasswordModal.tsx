// 비밀번호 변경 모달 — 현재PW / 새PW / 새PW확인 유효성 검사 포함
'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useUpdatePassword } from '@/hooks/useMyMutations'

// validator 상수 — packages/shared에 package.json 없어 직접 참조
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const VALIDATION_MESSAGES = {
  PASSWORD_FORMAT: '비밀번호는 영문+숫자 조합 8자 이상이어야 합니다',
  PASSWORD_CONFIRM: '비밀번호가 일치하지 않습니다',
} as const

interface EditPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

/** 비밀번호 필드 컴포넌트 */
function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: {
  id: string
  label: string
  value: string
  onChange: (val: string) => void
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoFocus={autoFocus}
          className={[
            'w-full px-3 py-2 pr-9 text-sm rounded-lg border bg-background text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-[var(--color-border)] focus:border-primary',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

/** 비밀번호 변경 모달 컴포넌트 */
export default function EditPasswordModal({ isOpen, onClose }: EditPasswordModalProps) {
  const [values, setValues] = useState<FormValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const { mutate, isLoading } = useUpdatePassword(onClose)

  /** 모달 열릴 때 초기화 */
  useEffect(() => {
    if (isOpen) {
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setErrors({})
    }
  }, [isOpen])

  /** 필드 변경 핸들러 */
  const handleChange = (field: keyof FormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  /** 폼 유효성 검사 */
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!values.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해 주세요.'
    }
    if (!PASSWORD_REGEX.test(values.newPassword)) {
      newErrors.newPassword = VALIDATION_MESSAGES.PASSWORD_FORMAT
    } else if (values.newPassword === values.currentPassword) {
      newErrors.newPassword = '현재 비밀번호와 다른 새 비밀번호를 입력해 주세요.'
    }
    if (values.newPassword !== values.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_CONFIRM
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /** 제출 처리 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await mutate(values.currentPassword, values.newPassword)
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
      aria-labelledby="edit-password-title"
    >
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id="edit-password-title"
            className="text-base font-semibold text-[var(--color-text-primary)]"
          >
            비밀번호 변경
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <PasswordInput
            id="current-password"
            label="현재 비밀번호"
            value={values.currentPassword}
            onChange={(val) => handleChange('currentPassword', val)}
            error={errors.currentPassword}
            disabled={isLoading}
            autoFocus
          />
          <PasswordInput
            id="new-password"
            label="새 비밀번호"
            value={values.newPassword}
            onChange={(val) => handleChange('newPassword', val)}
            error={errors.newPassword}
            disabled={isLoading}
          />
          <PasswordInput
            id="confirm-password"
            label="새 비밀번호 확인"
            value={values.confirmPassword}
            onChange={(val) => handleChange('confirmPassword', val)}
            error={errors.confirmPassword}
            disabled={isLoading}
          />

          <p className="text-xs text-[var(--color-text-muted)]">영문+숫자 조합 8자 이상</p>

          {/* 버튼 그룹 */}
          <div className="flex gap-2 justify-end pt-1">
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
              disabled={isLoading}
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
