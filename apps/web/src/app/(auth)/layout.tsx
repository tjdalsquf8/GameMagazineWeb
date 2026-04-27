// auth 레이아웃 — 로그인/회원가입 공통 래퍼
// 루트 레이아웃의 flex-1이 높이를 관리하므로 min-h-screen 불필요

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background px-4 py-12">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  )
}
