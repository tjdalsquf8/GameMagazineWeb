// 뉴스 상세 에러 바운더리 — 뉴스 상세 페이지에서 발생하는 에러를 잡아 안전한 에러 화면을 표시한다.
// 보안 핵심: error.message 및 스택트레이스를 절대 화면에 노출하지 않음.
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 뉴스 상세 에러 화면 컴포넌트
export default function NewsDetailError({ error, reset }: ErrorProps) {
  // [SECURITY] 프로덕션에서 에러 상세 정보 노출 방지 - 스택 트레이스/DB 정보 콘솔 출력 금지
  // 개발 디버깅용 — 화면에는 노출하지 않고 콘솔에만 기록
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <span className="text-6xl font-bold text-[var(--color-primary)] opacity-30">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          기사를 불러올 수 없습니다
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
            뉴스 목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
