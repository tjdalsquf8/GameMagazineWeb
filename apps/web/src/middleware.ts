import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 백엔드(Render)와 프론트(Vercel)가 다른 도메인이므로
// 백엔드가 설정한 HttpOnly 쿠키는 Vercel Edge에서 읽을 수 없음.
// 인증 체크는 각 레이아웃(my/layout.tsx, admin/layout.tsx)의 클라이언트 사이드에서 처리.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
