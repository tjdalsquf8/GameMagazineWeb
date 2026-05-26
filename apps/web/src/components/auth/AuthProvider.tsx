// 앱 초기화 시 silent refresh 처리 — accessToken이 없을 때 refreshToken으로 재발급
// accessToken은 HttpOnly 쿠키로 서버가 관리하므로 JS에서 직접 쿠키를 설정하지 않음
'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { refreshAccessToken } from '@/lib/auth/refreshSingleton'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setAuth, user } = useAuthStore()
  // StrictMode 더블 마운트 시 중복 호출 방지 — refreshSingleton이 네트워크 단에서도 막아주지만
  // 불필요한 Promise 생성 자체를 차단해 불필요한 상태 업데이트를 줄임
  const hasAttempted = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (accessToken) return
    if (hasAttempted.current) return
    hasAttempted.current = true

    refreshAccessToken().then((newToken) => {
      if (newToken) {
        setAuth(user, newToken)
      }
      // 실패해도 clearAuth 하지 않음 — accessToken 쿠키가 살아있으면 API 호출은 계속 작동
      // clearAuth는 apiClient의 401 인터셉터에서 처리
    })
  }, [isAuthenticated, user, accessToken, setAuth])

  return <>{children}</>
}
