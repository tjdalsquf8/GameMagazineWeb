// ──────────────────────────────────────────────────
// Console RSS 재작성 테스트
// 영문 기사 → 한국어 재작성
// 실행: npx ts-node test-console-rewrite.ts
// 필요: export ANTHROPIC_API_KEY=sk-ant-...
// ──────────────────────────────────────────────────

import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; GameMagazinePOC/1.0)" },
});

const SOURCES = [
  {
    name: "Push Square",
    url: "https://www.pushsquare.com/feeds/latest",
    platform: "PlayStation",
  },
  {
    name: "Pure Xbox",
    url: "https://www.purexbox.com/feeds/latest",
    platform: "Xbox",
  },
  {
    name: "Nintendo Life",
    url: "https://www.nintendolife.com/feeds/latest",
    platform: "Nintendo",
  },
];

const SYSTEM_PROMPT = `당신은 게임 매거진의 전문 편집자입니다.
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
}`;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function rewriteArticle(
  title: string,
  content: string,
  platform: string,
): Promise<any> {
  const apiKey =
    process.env.ANTHROPIC_API_KEY ??
    "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";
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY 없음");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `플랫폼: Console > ${platform}\n\n원문 제목: ${title}\n\n원문 내용:\n${content}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Claude API 오류: ${res.status}`);
  const data = (await res.json()) as any;
  const text = data.content?.[0]?.text ?? "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function main() {
  console.log("════════════════════════════════════════════════");
  console.log("  Console RSS 재작성 테스트 (영문 → 한국어)");
  console.log("════════════════════════════════════════════════\n");

  // 소스별 첫 번째 기사 1건씩 재작성 (총 3건)
  for (const source of SOURCES) {
    console.log(`\n${"─".repeat(54)}`);
    console.log(`  [ ${source.name} — ${source.platform} ]`);
    console.log("─".repeat(54));

    try {
      const feed = await parser.parseURL(source.url);
      const item = (feed.items ?? [])[0] as any;
      if (!item) {
        console.log("  기사 없음");
        continue;
      }

      const title = item.title?.trim() ?? "";
      const rawContent =
        item["content:encoded"] ?? item.content ?? item.summary ?? "";
      const content = stripHtml(rawContent).substring(0, 1000);

      console.log(`  원문 제목: ${title}`);
      console.log(`  원문 길이: ${content.length}자\n`);

      const start = Date.now();
      const result = await rewriteArticle(title, content, source.platform);
      const elapsed = Date.now() - start;

      console.log(`  ✅ 재작성 완료 (${elapsed}ms)\n`);
      console.log(`  제목:  ${result.title}`);
      console.log(`  요약:  ${result.summary}`);
      console.log(`  태그:  ${result.tags?.join(", ")}\n`);
      console.log(`  본문:`);
      result.body?.split("\n\n").forEach((p: string, i: number) => {
        console.log(`  [${i + 1}] ${p}\n`);
      });
    } catch (err: any) {
      console.log(`  ❌ 실패: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("═".repeat(54));
  console.log("  확인 포인트");
  console.log("═".repeat(54));
  console.log("  자연스러운 한국어로 재작성됐는가?");
  console.log("  제목이 주어+핵심사건 구조인가?");
  console.log("  영문 고유명사(Xbox 등)가 적절히 유지됐는가?");
  console.log("  본문이 3~4문단으로 깔끔한가?");
}

main().catch(console.error);
