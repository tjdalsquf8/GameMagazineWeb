// 카드뉴스 슬라이드 컴포넌트 — html2canvas 캡처 대상, 실제 1080×1350 크기로 렌더링
'use client'

import { forwardRef } from 'react'

interface CardNewsSlideProps {
  html: string
  slideNo: number
  total: number
}

/** html2canvas 캡처를 위해 forwardRef 사용, 실제 1080×1350 크기로 렌더링 */
const CardNewsSlide = forwardRef<HTMLDivElement, CardNewsSlideProps>(
  ({ html }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: 1080, height: 1350, overflow: 'hidden', position: 'relative' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
)
CardNewsSlide.displayName = 'CardNewsSlide'

export default CardNewsSlide
