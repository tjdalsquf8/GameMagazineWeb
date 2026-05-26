// 공유 refresh 싱글톤 — AuthProvider와 apiClient가 동시에 refresh를 호출할 때
// 토큰 로테이션 레이스 컨디션을 방지하기 위해 단 하나의 Promise만 유지한다.
import { env } from '@/lib/env'

const BASE_URL = env.apiUrl

let refreshPromise: Promise<string | null> | null = null

/** refreshToken 쿠키로 새 accessToken 발급 — 동시 호출 시 동일 Promise 반환 */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) return null
      const json = await res.json()
      if (!json.success) return null
      return (json.data?.accessToken as string) ?? null
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
