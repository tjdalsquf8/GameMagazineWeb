// 다크모드 상태 관리 커스텀 훅
// localStorage 'theme' 키로 테마 저장, html 태그 dark 클래스 토글
import { useState, useEffect } from 'react'

// 초기 다크모드 상태를 계산하는 함수 (SSR 안전)
function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 다크모드 상태와 토글 함수를 반환하는 훅
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(false)

  // 클라이언트 마운트 시 초기값 설정
  useEffect(() => {
    setIsDark(getInitialDark())
  }, [])

  // isDark 변경 시 html 클래스 및 localStorage 업데이트
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // 다크모드 토글 함수
  const toggle = () => setIsDark((prev) => !prev)

  return { isDark, toggle }
}
