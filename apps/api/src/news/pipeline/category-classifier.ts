// apps/api/src/news/pipeline/category-classifier.ts
// 뉴스 기사 제목을 키워드 매칭 또는 Claude API를 통해 카테고리로 분류

import Anthropic from '@anthropic-ai/sdk'
import {
  SUB_CATEGORIES,
  FALLBACKS,
  MainCategory,
} from '../constants/CategoryKeywords'

// 분류 결과 인터페이스
export interface ClassifyResult {
  mainCategory: string
  subCategory: string
  method: 'keyword' | 'claude'
}

// Claude API 응답 아이템 타입
interface ClaudeClassifyItem {
  index: number
  mainCategory: string
  subCategory: string
}

// 1단계: 키워드 매칭으로 카테고리 분류 — SUB_CATEGORIES 순회하며 제목에 키워드 포함 여부 확인
export function classifyByKeyword(title: string): ClassifyResult | null {
  const lowerTitle = title.toLowerCase()

  const mainCategories = Object.keys(SUB_CATEGORIES) as MainCategory[]

  for (const mainCategory of mainCategories) {
    const subCategoryList = SUB_CATEGORIES[mainCategory]

    for (const subCat of subCategoryList) {
      const hasKeyword = subCat.keywords.some((kw) =>
        lowerTitle.includes(kw.toLowerCase()),
      )

      if (!hasKeyword) continue

      // exclude 조건 확인 — 제외 키워드가 있으면 이 소분류는 스킵
      const isExcluded = subCat.exclude?.some((ex) =>
        lowerTitle.includes(ex.toLowerCase()),
      )

      if (isExcluded) continue

      return {
        mainCategory,
        subCategory: subCat.name,
        method: 'keyword',
      }
    }
  }

  return null
}

// 2단계: Claude API 배치 분류 — 키워드 미분류 기사 제목 목록을 Claude에게 일괄 분류 요청
export async function classifyWithClaude(
  titles: string[],
  anthropic: Anthropic,
): Promise<ClassifyResult[]> {
  if (titles.length === 0) return []

  const titlesText = titles.map((t, i) => `${i}. ${t}`).join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `게임 뉴스 제목을 분류해주세요.
mainCategory: PC / Mobile / Console / Esports / 기타
subCategory: 소분류 목록 중 하나, 없으면 "기타 [대분류]"

PC: 리그오브레전드, 발로란트, 오버워치, 배틀그라운드, 로스트아크, 메이플스토리, 던전앤파이터, 디아블로, 붉은사막
Mobile: 원신, 붕괴: 스타레일, 워스텔링, 배틀그라운드 모바일, 리니지M, 나혼자만레벨업, 메이플스토리M, 승리의 여신: 니케
Console: 파이널판타지, GTA, 젤다, 몬스터헌터, 붉은사막
Esports: LCK, VCT

JSON으로만 응답:
[{"index": 0, "mainCategory": "PC", "subCategory": "기타 PC"}]

제목 목록:
${titlesText}`,
      },
    ],
  })

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed: ClaudeClassifyItem[] = []

  try {
    // JSON 블록 추출 시도
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]) as ClaudeClassifyItem[]
    }
  } catch {
    // 파싱 실패 시 전체 기타 처리
    return titles.map(() => ({
      mainCategory: '기타',
      subCategory: '기타',
      method: 'claude' as const,
    }))
  }

  return titles.map((_, i) => {
    const item = parsed.find((p) => p.index === i)

    if (!item) {
      return {
        mainCategory: '기타',
        subCategory: FALLBACKS['PC'],
        method: 'claude' as const,
      }
    }

    const mainCat = item.mainCategory as MainCategory
    const fallback = FALLBACKS[mainCat] ?? '기타'

    return {
      mainCategory: item.mainCategory,
      subCategory: item.subCategory || fallback,
      method: 'claude' as const,
    }
  })
}
