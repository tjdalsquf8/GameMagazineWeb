import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import ToastContainer from '@/components/ui/ToastContainer'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
