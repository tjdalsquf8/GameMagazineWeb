// 광고 자리 placeholder 컴포넌트
// 728×90 사이즈 느낌의 점선 박스로 광고 영역을 표시
// 다크모드 대응: border-dashed, text-muted 활용

// 광고 배너 플레이스홀더 컴포넌트
export function AdBanner() {
  return (
    <div
      className="w-full min-h-[90px] border border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-center text-sm text-[var(--color-text-muted)] mb-8"
      aria-hidden="true"
    >
      📢 광고 (728×90)
    </div>
  )
}
