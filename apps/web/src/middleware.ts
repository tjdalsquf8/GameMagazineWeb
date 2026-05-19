import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 인증이 필요한 경로
const PROTECTED_PATHS = ['/community/write', '/my']

// 어드민 전용 경로
const ADMIN_PATHS = ['/admin']

// JWT 서명 검증 및 payload 반환 — jose 사용 (Edge Runtime 호환)
async function verifyToken(token: string): Promise<{ valid: boolean; role?: string }> {
  const secret = process.env.JWT_SECRET
  if (!secret) return { valid: false }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return { valid: true, role: typeof payload.role === 'string' ? payload.role : undefined }
  } catch {
    return { valid: false }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected) {
    const token = request.cookies.get('accessToken')?.value
    const { valid } = token ? await verifyToken(token) : { valid: false }

    if (!valid) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (isAdminPath) {
    const token = request.cookies.get('accessToken')?.value
    const { valid, role } = token ? await verifyToken(token) : { valid: false, role: undefined }

    if (!valid) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/community/write', '/my', '/my/:path*', '/admin', '/admin/:path*'],
}
