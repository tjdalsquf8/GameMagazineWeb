// apps/api/src/news/pipeline/article-rewriter.ts
// 원문 기사를 Claude API를 통해 게임 매거진 스타일로 재작성

import Anthropic from '@anthropic-ai/sdk'

// 재작성 결과 인터페이스
export interface RewriteResult {
  title: string
  summary: string
  body: string
  tags: string[]
}

// Claude API 응답 JSON 타입
interface RewriteResponseJson {
  title: string
  summary: string
  body: string
  tags: string[]
}

const SYSTEM_PROMPT = `당신은 게임 매거진의 전문 편집자입니다.

[제목 규칙]
- "주어 + 핵심 사건" 구조
- 독자가 제목만 봐도 무슨 일인지 즉시 파악 가능
- 낚시성 표현, 물음표 제목 금지

[본문 규칙]
- 3~4문단, 각 문단 2~3문장
- 1문단: 핵심 (무엇이, 언제, 어떻게)
- 2문단: 주요 세부 내용 (1~2개만)
- 3문단: 배경 또는 의미
- 4문단: 출시일, 플랫폼 (해당시만)
- 여러 게임 다루는 기사는 가장 중요한 것 1~2개에만 집중
- 나열식 금지, 흐름 있는 문장 유지

[문체]
- 간결하고 명확한 사실 중심
- 불확실한 표현 금지
- 원문 문장 재사용 절대 금지
- 출처 언급 금지

JSON으로만 응답:
{
  "title": "재작성된 제목",
  "summary": "한 줄 요약 (50자 이내)",
  "body": "재작성된 본문 (문단 구분은 \\n\\n 사용)",
  "tags": ["태그1", "태그2", "태그3"]
}`

// 원문 기사를 Claude API를 이용해 게임 매거진 스타일로 재작성하여 반환
export async function rewriteArticle(
  title: string,
  content: string,
  mainCategory: string,
  subCategory: string,
  anthropic: Anthropic,
): Promise<RewriteResult> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `카테고리: ${mainCategory} > ${subCategory}

제목: ${title}

본문:
${content}`,
      },
    ],
  })

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Claude 재작성 응답에서 JSON을 찾을 수 없습니다.')
  }

  const parsed = JSON.parse(jsonMatch[0]) as RewriteResponseJson

  return {
    title: parsed.title ?? title,
    summary: parsed.summary ?? '',
    body: parsed.body ?? '',
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  }
}
