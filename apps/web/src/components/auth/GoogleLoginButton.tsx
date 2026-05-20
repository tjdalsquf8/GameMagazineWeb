// Google OAuth 로그인 버튼 컴포넌트
// 클릭 시 백엔드 Google OAuth 진입점으로 리디렉션하여 소셜 로그인을 시작한다.

'use client'

// Google 공식 G 로고 SVG 아이콘 컴포넌트
function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}

// 구분선 컴포넌트 — "또는" 텍스트를 가운데에 두고 양쪽으로 선을 표시한다
function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-text-muted shrink-0">또는</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// Google OAuth 로그인 버튼 — 클릭 시 백엔드 /api/auth/google 엔드포인트로 리디렉션한다
export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
    window.location.href = `${apiUrl}/api/auth/google`
  }

  return (
    <>
      <Divider />
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 bg-white text-[#3c4043] text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-white dark:hover:bg-gray-50"
      >
        <GoogleIcon />
        Google로 계속하기
      </button>
    </>
  )
}
