// 앱 초기화 시 silent refresh 처리 — accessToken 쿠키 만료 시 refreshToken으로 재발급
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

/** accessToken 쿠키 존재 여부 확인 */
function hasAccessTokenCookie(): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith('accessToken='))
}

/** refreshToken으로 새 accessToken 발급 후 쿠키 세팅 */
async function silentRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success) return null
    return json.data.accessToken ?? null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setAuth, clearAuth, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // accessToken 쿠키가 살아있으면 아무것도 하지 않음
    if (hasAccessTokenCookie()) return

    // 쿠키 만료 → refreshToken으로 재발급 시도
    silentRefresh().then((newToken) => {
      if (newToken) {
        // 새 토큰을 스토어 + 쿠키에 반영
        setAuth(user, newToken)
        document.cookie = `accessToken=${newToken}; path=/; max-age=86400`
      } else {
        // refreshToken도 만료 → 완전 로그아웃
        clearAuth()
        document.cookie = 'accessToken=; path=/; max-age=0'
      }
    })
  }, [isAuthenticated, user, accessToken, setAuth, clearAuth])

  return <>{children}</>
}
