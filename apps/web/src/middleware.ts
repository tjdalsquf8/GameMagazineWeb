import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요한 경로
const PROTECTED_PATHS = ['/community/write']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected) {
    // 실제 인증 토큰 확인 (추후 JWT 검증으로 대체)
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/community/write'],
}
