// poc/run-console-pipeline.ts
// Console 파이프라인 단독 실행 스크립트 — RSS 수집 → 재작성 → DB 저장
// 실행: cd apps/api && npx tsx ../../poc/run-console-pipeline.ts

import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import Parser from 'rss-parser'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// .env 로드 (apps/api/.env 기준)
const envPath = path.resolve(__dirname, '../apps/api/.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config()
}

// Console 소스 목록
const CONSOLE_SOURCES = [
  { name: 'Push Square',   url: 'https://www.pushsquare.com/feeds/latest',    language: 'en', platform: 'PlayStation' },
  { name: 'Pure Xbox',     url: 'https://www.purexbox.com/feeds/latest',       language: 'en', platform: 'Xbox' },
  { name: 'Nintendo Life', url: 'https://www.nintendolife.com/feeds/latest',   language: 'en', platform: 'Nintendo' },
]

// Console 재작성 프롬프트
const CONSOLE_REWRITE_PROMPT = `당신은 게임 매거진의 전문 편집자입니다.
영문 게임 뉴스 원문을 받아 한국어로 완전히 새롭게 작성하세요.

[제목 규칙]
- "주어 + 핵심 사건" 구조
- 독자가 제목만 봐도 무슨 일인지 즉시 파악 가능
- 낚시성 표현, 물음표 제목 금지
- 영문 고유명사(Xbox, PlayStation, Nintendo 등)는 그대로 사용

[본문 규칙]
- 3~4문단, 각 문단 2~3문장
- 1문단: 핵심 (무엇이, 언제, 어떻게)
- 2문단: 주요 세부 내용 (1~2개만)
- 3문단: 배경 또는 의미
- 4문단: 출시일, 가격, 접근 방법 (해당시만)
- 나열식 금지, 흐름 있는 문장 유지

[문체]
- 간결하고 명확한 사실 중심
- 불확실한 표현 금지
- 원문 문장 재사용 절대 금지
- 출처 언급 금지
- 자연스러운 한국어로 작성

반드시 아래 JSON으로만 응답:
{
  "title":   "재작성된 제목 (한국어)",
  "summary": "한 줄 요약 (50자 이내, 한국어)",
  "body":    "재작성된 본문 (문단 구분은 \\n\\n, 한국어)",
  "tags":    ["태그1", "태그2", "태그3"]
}`

// HTML 제거 유틸
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '')
    .replace(/\s{2,}/g, ' ').trim()
}

// Claude로 Console 기사 재작성
async function rewriteConsoleArticle(
  title: string,
  content: string,
  platform: string,
  anthropic: Anthropic,
) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: CONSOLE_REWRITE_PROMPT,
    messages: [{
      role: 'user',
      content: `플랫폼: Console > ${platform}\n\n원문 제목: ${title}\n\n원문 내용:\n${content}`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude 응답에서 JSON을 찾을 수 없습니다.')

  const parsed = JSON.parse(jsonMatch[0]) as {
    title: string; summary: string; body: string; tags: string[]
  }
  return {
    title: parsed.title ?? title,
    summary: parsed.summary ?? '',
    body: parsed.body ?? '',
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  }
}

async function main() {
  const prisma = new PrismaClient()
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const parser = new Parser({
    customFields: { item: ['content:encoded', 'description'] },
    timeout: 10000,
  })

  const result = { saved: 0, skipped: 0, failed: 0 }

  console.log('=== Console 파이프라인 시작 ===\n')

  for (const source of CONSOLE_SOURCES) {
    console.log(`[${source.name}] RSS 수집 중...`)

    let articles: Parser.Item[]
    try {
      const feed = await parser.parseURL(source.url)
      articles = feed.items
      console.log(`[${source.name}] ${articles.length}개 기사 수집`)
    } catch (err) {
      console.error(`[${source.name}] RSS 수집 실패:`, err instanceof Error ? err.message : err)
      result.failed++
      continue
    }

    for (const item of articles) {
      const title = item.title?.trim() ?? ''
      const link = item.link ?? ''

      if (!title || !link) { result.skipped++; continue }

      // 중복 체크
      const existing = await prisma.news.findUnique({ where: { originalLink: link } })
      if (existing) { result.skipped++; continue }

      try {
        const rawContent =
          (item['content:encoded'] as string | undefined) ??
          item.content ?? item.summary ?? item.contentSnippet ?? ''
        const content = stripHtml(rawContent).slice(0, 1000)

        const rewritten = await rewriteConsoleArticle(title, content, source.platform, anthropic)

        await prisma.news.create({
          data: {
            originalTitle: title,
            originalLink: link,
            originalPubDate: item.pubDate ? new Date(item.pubDate) : null,
            sourceName: source.name,
            mainCategory: 'Console',
            subCategory: source.platform,
            classifyMethod: 'fixed',
            rewrittenTitle: rewritten.title,
            rewrittenSummary: rewritten.summary,
            rewrittenBody: rewritten.body,
            tags: rewritten.tags,
            status: 'PUBLISHED',
          },
        })

        result.saved++
        console.log(`  ✅ 저장: ${rewritten.title}`)

        // API 레이트 리밋 방지
        await new Promise(r => setTimeout(r, 500))
      } catch (err) {
        console.error(`  ❌ 실패: ${title}`, err instanceof Error ? err.message : err)
        result.failed++
      }
    }
  }

  await prisma.$disconnect()

  console.log('\n=== 완료 ===')
  console.log(`saved: ${result.saved} / skipped: ${result.skipped} / failed: ${result.failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
