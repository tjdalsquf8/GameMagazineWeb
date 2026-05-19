// 앱 초기화 시 silent refresh 처리 — accessToken이 없을 때 refreshToken으로 재발급
// accessToken은 HttpOnly 쿠키로 서버가 관리하므로 JS에서 직접 쿠키를 설정하지 않음
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { env } from '@/lib/env'

const BASE_URL = env.apiUrl

/** refreshToken으로 새 accessToken 발급 요청 — 서버가 HttpOnly 쿠키로 자동 설정 */
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

    // accessToken이 메모리(스토어)에 있으면 아무것도 하지 않음
    // (accessToken은 localStorage에 저장되지 않으므로 새로고침 시 항상 null → silentRefresh 실행)
    if (accessToken) return

    // 메모리에 토큰 없음 → refreshToken 쿠키로 재발급 시도
    // 서버가 새 accessToken을 HttpOnly 쿠키로 설정하고, 응답 body에도 반환
    silentRefresh().then((newToken) => {
      if (newToken) {
        // 새 토큰을 스토어(메모리)에만 반영 — 쿠키는 서버가 HttpOnly로 자동 설정
        setAuth(user, newToken)
      } else {
        // refreshToken도 만료 → 완전 로그아웃
        clearAuth()
      }
    })
  }, [isAuthenticated, user, accessToken, setAuth, clearAuth])

  return <>{children}</>
}
