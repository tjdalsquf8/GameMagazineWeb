import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요한 경로
const PROTECTED_PATHS = ['/community/write', '/my']

// JWT payload의 exp 클레임으로 만료 여부 확인 (서명 검증 없이 — redirect 로직 전용)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected) {
    const token = request.cookies.get('accessToken')?.value

    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/community/write', '/my', '/my/:path*'],
}
