// 커스텀 404 Not Found 페이지 — App Router용 서버 컴포넌트
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center">
      <div className="container-main w-full">
        <div className="max-w-lg">
          {/* 에러 코드 레이블 */}
          <p className="text-sm tracking-widest uppercase text-[var(--color-text-muted)] dark:text-[var(--color-text-muted)] mb-4">
            404
          </p>

          {/* 메인 제목 */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)] mb-4">
            페이지를 찾을 수<br />
            없습니다
          </h1>

          {/* 설명 */}
          <p className="text-base text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] mb-6">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>

          {/* 구분선 */}
          <div className="border-t border-[var(--color-border)] dark:border-[var(--color-border)] w-12 mb-8" />

          {/* 버튼 영역 */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-[var(--color-primary)] text-[var(--color-primary-foreground)] dark:bg-[var(--color-primary)] dark:text-[var(--color-primary-foreground)] rounded-md hover:opacity-80 transition-opacity"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
