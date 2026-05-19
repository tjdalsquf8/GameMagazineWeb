// 루트 에러 바운더리 — 앱 전체에서 처리되지 않은 에러를 잡아 generic 에러 화면을 표시한다.
// 보안 핵심: error.message 및 스택트레이스를 절대 화면에 노출하지 않음.
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 루트 에러 화면 컴포넌트
export default function RootError({ error, reset }: ErrorProps) {
  // 개발 디버깅용 — 화면에는 노출하지 않고 콘솔에만 기록
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <span className="text-6xl font-bold text-[var(--color-primary)] opacity-30">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          오류가 발생했습니다
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg border border-[var(--color-border)] text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
