// 뉴스 핵심 요약 박스 컴포넌트
// summary 문자열을 문장 단위로 분리해 ▶ bullet 형태로 표시
// 왼쪽 굵은 세로줄 border + 연한 배경으로 시각적 강조

interface SummaryBoxProps {
  summary: string
}

// summary를 문장 단위로 분리 — '. ' 기준, 빈 문장 제거
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

// 핵심 요약 박스 컴포넌트 — summary가 없으면 렌더링하지 않음
export function SummaryBox({ summary }: SummaryBoxProps) {
  if (!summary) return null

  const sentences = splitSentences(summary)

  return (
    <div className="border-l-4 border-[var(--color-primary)] bg-[var(--color-surface)] rounded-r-lg p-4 mb-6">
      <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">📋 핵심 요약</p>
      <ul className="space-y-1.5">
        {sentences.map((sentence, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-[var(--color-text-muted)] leading-relaxed"
          >
            <span className="shrink-0 text-[var(--color-primary)] mt-0.5">▶</span>
            <span>{sentence}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
