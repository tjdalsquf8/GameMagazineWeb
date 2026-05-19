// 환경변수 검증 모듈 — 필수 환경변수 누락 시 빌드/서버 시작 단계에서 즉시 에러를 던짐.
// 이 모듈을 import하는 쪽은 항상 검증된 값을 받는다.

/**
 * NEXT_PUBLIC_API_URL 환경변수를 검증하고 반환.
 * 값이 없으면 에러를 throw해 빌드·서버 시작을 중단시킨다.
 */
function requireApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL
  if (!value) {
    throw new Error(
      '[env] NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.\n' +
        '배포 환경에서는 Vercel 환경변수를 확인하세요.\n' +
        '로컬 개발 환경에서는 apps/web/.env.local 에 NEXT_PUBLIC_API_URL=http://localhost:3001 을 추가하세요.'
    )
  }
  return value
}

export const env = {
  apiUrl: requireApiUrl(),
} as const
