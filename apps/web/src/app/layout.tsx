// 루트 레이아웃 — 전체 페이지 공통 구조
// Header, Footer 포함, 다크모드 깜빡임 방지 인라인 스크립트 포함
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import ToastContainer from '@/components/ui/ToastContainer'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import AuthProvider from '@/components/auth/AuthProvider'

const pretendard = localFont({
  src: [
    {
      path: '../fonts/pretendard/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Game Magazine',
  description: '게임 뉴스 매거진 — 최신 게임 뉴스와 커뮤니티',
}

// 루트 레이아웃 컴포넌트 — 모든 페이지의 공통 래퍼
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&p)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${pretendard.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
