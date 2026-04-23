'use client'

import { useState } from 'react'
import RegisterStep1 from '@/components/auth/RegisterStep1'
import RegisterStep2 from '@/components/auth/RegisterStep2'
import RegisterStep3 from '@/components/auth/RegisterStep3'

type Step = 1 | 2 | 3

const STEP_LABELS = ['이메일 인증', '코드 확인', '비밀번호 설정']

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')

  const handleStep1Next = (nextEmail: string, nextNickname: string) => {
    setEmail(nextEmail)
    setNickname(nextNickname)
    setStep(2)
  }

  const handleStep2Next = () => {
    setStep(3)
  }

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : 1))
  }

  return (
    <div className="pt-2 pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-6">회원가입</h1>

        {/* 진행 표시바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-text-muted">
            {STEP_LABELS.map((label, idx) => (
              <span key={label} className={idx + 1 <= step ? 'text-text-primary font-medium' : ''}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <p className="text-right text-xs text-text-muted">{step} / 3</p>
        </div>
      </div>

      {/* Step 슬라이드 애니메이션 컨테이너 */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Step 1 */}
          <div className="w-full flex-shrink-0">
            <RegisterStep1 onNext={handleStep1Next} />
          </div>

          {/* Step 2 */}
          <div className="w-full flex-shrink-0">
            {step >= 2 && (
              <RegisterStep2 email={email} onNext={handleStep2Next} onBack={handleBack} />
            )}
          </div>

          {/* Step 3 */}
          <div className="w-full flex-shrink-0">
            {step === 3 && <RegisterStep3 email={email} nickname={nickname} onBack={handleBack} />}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-text-primary font-medium hover:underline">
          로그인
        </a>
      </p>
    </div>
  )
}
