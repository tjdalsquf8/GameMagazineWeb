// ──────────────────────────────────────────────────
// VCT Step 1+2: vlrggapi 수집 + Claude 기사 생성
// 실행: npx ts-node test-vct.ts
// 필요: export ANTHROPIC_API_KEY=sk-ant-...
// ──────────────────────────────────────────────────

const VLR_BASE = "https://vlrggapi.vercel.app";

const ESPORTS_PROMPT = `당신은 VCT 발로란트 이스포츠 전문 기자입니다.
경기 결과 데이터를 받아 간결하고 명확한 경기 결과 기사를 작성하세요.

[제목 규칙]
- "팀명, 상대팀 꺾고 결과" 구조
- 완승(0맵 내줌)이면 "완파", "셧아웃" 등 표현 사용
- 예시: "T1, Gen.G 완파하며 VCT Pacific 선두 굳혀"

[본문 규칙]
- 2~3문단, 각 문단 2~3문장
- 1문단: 경기 결과 핵심 (누가, 몇 대 몇, 어느 대회)
- 2문단: 대회 맥락 (몇 주차, 의미)
- 3문단: (선택) 다음 일정 또는 의미
- 제공된 데이터 외 내용 절대 추측 금지
- 선수 개인 기록 언급 금지

[문체]
- 간결하고 사실 중심
- 발로란트 이스포츠 전문 용어 사용
- 출처 언급 금지

반드시 아래 JSON으로만 응답:
{
  "title":   "기사 제목",
  "summary": "한 줄 요약 (50자 이내)",
  "body":    "본문 (문단 구분 \\n\\n)",
  "tags":    ["태그1", "태그2", "태그3"]
}`;

// ── VCT 경기 수집 ─────────────────────────────────

async function fetchVctResults() {
  console.log("[ 1단계 ] vlrggapi 경기 결과 수집 중...");
  const res = await fetch(`${VLR_BASE}/v2/match?q=results`, {
    headers: { "User-Agent": "GameMagazinePOC/1.0" },
  });
  if (!res.ok) throw new Error(`vlrggapi 실패: ${res.status}`);

  const data = (await res.json()) as any;
  const segments = data?.data?.segments ?? [];
  console.log(`→ 전체 ${segments.length}건 수신\n`);

  // 전체 대회 목록 출력
  const events = [...new Set(segments.map((s: any) => s.match_event))];
  console.log("[ 수집된 대회 목록 ]");
  events.forEach((e: any) => console.log(`  · ${e}`));

  // VCT Pacific 필터
  const pacific = segments.filter(
    (s: any) =>
      s.match_event?.toLowerCase().includes("vct") &&
      s.match_event?.toLowerCase().includes("pacific"),
  );
  console.log(`\n→ VCT Pacific 경기: ${pacific.length}건\n`);

  return { all: segments, pacific };
}

// ── 기사 생성 ─────────────────────────────────────

function buildContext(match: any): string {
  const score1 = parseInt(match.score1 ?? "0", 10);
  const score2 = parseInt(match.score2 ?? "0", 10);
  const winner = score1 > score2 ? match.team1 : match.team2;
  const loser = score1 > score2 ? match.team2 : match.team1;
  const winScore = Math.max(score1, score2);
  const loseScore = Math.min(score1, score2);

  return `
경기 정보:
- 대회: ${match.match_event}
- 라운드: ${match.match_series}
- 승팀: ${winner}
- 패팀: ${loser}
- 스코어: ${winner} ${winScore} : ${loseScore} ${loser}
- 결과: ${winner} 승리${loseScore === 0 ? " (완승)" : ""}
`.trim();
}

async function generateArticle(context: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
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
      system: ESPORTS_PROMPT,
      messages: [{ role: "user", content: context }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API 오류: ${res.status}`);
  const data = (await res.json()) as any;
  const text = data.content?.[0]?.text ?? "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── 메인 ─────────────────────────────────────────

async function main() {
  console.log("════════════════════════════════════════════════");
  console.log("  VCT 파이프라인 테스트 (vlrggapi + Claude)");
  console.log("════════════════════════════════════════════════\n");

  const { pacific } = await fetchVctResults();

  if (pacific.length === 0) {
    console.log("⚠️  VCT Pacific 경기 없음");
    console.log("→ 필터 조건 확인 또는 다른 대회명으로 재시도");
    return;
  }

  // 최근 3경기 기사 생성
  const testMatches = pacific.slice(0, 3);
  console.log(`[ 2단계 ] 기사 생성 (${testMatches.length}건)\n`);

  for (let i = 0; i < testMatches.length; i++) {
    const match = testMatches[i];
    const score1 = parseInt(match.score1 ?? "0", 10);
    const score2 = parseInt(match.score2 ?? "0", 10);
    const context = buildContext(match);

    console.log(`${"─".repeat(54)}`);
    console.log(`  경기 ${i + 1} / ${testMatches.length}`);
    console.log(`  ${match.team1} ${score1} : ${score2} ${match.team2}`);
    console.log(`  ${match.match_event} — ${match.match_series}\n`);

    try {
      const start = Date.now();
      const article = await generateArticle(context);
      const elapsed = Date.now() - start;

      console.log(`  ✅ 완료 (${elapsed}ms)`);
      console.log(`  제목:  ${article.title}`);
      console.log(`  요약:  ${article.summary}`);
      console.log(`  태그:  ${article.tags?.join(", ")}\n`);
      console.log(`  본문:`);
      article.body?.split("\n\n").forEach((p: string, pi: number) => {
        console.log(`  [${pi + 1}] ${p}\n`);
      });
    } catch (err: any) {
      console.log(`  ❌ 실패: ${err.message}\n`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("═".repeat(54));
  console.log("  확인 포인트");
  console.log("═".repeat(54));
  console.log("  VCT Pacific 경기가 정상 수집됐는가?");
  console.log("  T1, 젠지 등 한국팀 경기가 포함됐는가?");
  console.log("  기사 문체가 이스포츠답게 자연스러운가?");
  console.log("  없는 정보를 지어내지 않았는가?");
}

main().catch((err) => {
  console.error("실행 실패:", err.message);
  process.exit(1);
});
