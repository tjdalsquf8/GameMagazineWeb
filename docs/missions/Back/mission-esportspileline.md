# Esports 파이프라인 — 백엔드 통합 명세서

## 목표

기존 RSS 기반 뉴스 파이프라인에 Esports LCK 경기 결과 수집을 추가한다.
소스 수집 부분만 다르고 재작성·DB 저장 구조는 기존과 동일하게 사용한다.

---

## 전체 파이프라인 구조

```
runNewsPipeline() — 기존 스케줄러 그대로 사용 (09:00 / 15:00 / 21:00)
        │
        ├── RSS 파이프라인 (기존)
        │   게임메카 RSS → 분류 → 재작성 → DB
        │
        └── Esports 파이프라인 (추가)
            lolesports API → 기사 생성 → DB (LCK 고정)
```

---

## 수정할 파일

```
apps/api/src/news/
├── news.service.ts              ← runEsportsPipeline() 추가
└── pipeline/
    └── esports-collector.ts     ← 신규 파일 (경기 데이터 수집)
```

---

## 1. Esports 수집기 (`pipeline/esports-collector.ts`)

```typescript
// lolesports 비공식 API — 별도 API 키 불필요
// 경고: 비공식 API로 라이엇이 언제든 변경 가능
//       응답 구조 변경 시 이 파일만 수정하면 됨

const LOLESPORTS_BASE = "https://esports-api.lolesports.com/persisted/gw";
const LOLESPORTS_KEY = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z";
const LCK_LEAGUE_ID = "98767991310872058";

// 팀명 한국어 매핑
const TEAM_KO: Record<string, string> = {
  T1: "T1",
  "Gen.G Esports": "젠지",
  "Dplus KIA": "디플러스 기아",
  "kt Rolster": "KT 롤스터",
  "Hanwha Life Esports": "한화생명 e스포츠",
  "NONGSHIM RED FORCE": "농심 레드포스",
  "HANJIN BRION": "한진 브리온",
  "DN SOOPers": "DN 수퍼스",
  "KIWOOM DRX": "키움 DRX",
  "BNK FEARX": "BNK 피어엑스",
};

export interface LckMatch {
  matchId: string; // 중복 체크용 고유 ID
  blockName: string; // "3주 차"
  startTime: string; // ISO 날짜
  winnerName: string; // 한국어 팀명
  loserName: string;
  winScore: number;
  loseScore: number;
  format: number; // BO3 → 3
  winRecord?: { wins: number; losses: number };
  loseRecord?: { wins: number; losses: number };
}

// 완료된 경기 목록 수집
export async function fetchCompletedLckMatches(): Promise<LckMatch[]> {
  const url = `${LOLESPORTS_BASE}/getSchedule?hl=ko-KR&leagueId=${LCK_LEAGUE_ID}`;
  const res = await fetch(url, {
    headers: { "x-api-key": LOLESPORTS_KEY },
  });
  if (!res.ok) throw new Error(`lolesports API 실패: ${res.status}`);

  const data = (await res.json()) as any;
  const events = data?.data?.schedule?.events ?? [];

  return events
    .filter((e: any) => e.state === "completed")
    .map((e: any) => {
      const teamA = e.match.teams[0];
      const teamB = e.match.teams[1];
      const scoreA = teamA.result?.gameWins ?? 0;
      const scoreB = teamB.result?.gameWins ?? 0;
      const winner = scoreA > scoreB ? teamA : teamB;
      const loser = scoreA > scoreB ? teamB : teamA;

      return {
        matchId: e.match.id,
        blockName: e.blockName,
        startTime: e.startTime,
        winnerName: TEAM_KO[winner.name] ?? winner.name,
        loserName: TEAM_KO[loser.name] ?? loser.name,
        winScore: Math.max(scoreA, scoreB),
        loseScore: Math.min(scoreA, scoreB),
        format: e.match.strategy.count,
        winRecord: winner.record,
        loseRecord: loser.record,
      };
    });
}

// 경기 데이터 → Claude 입력 텍스트 변환
export function buildMatchContext(match: LckMatch): string {
  const date = new Date(match.startTime).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const winRecordStr = match.winRecord
    ? `(현재 ${match.winRecord.wins}승 ${match.winRecord.losses}패)`
    : "";
  const loseRecordStr = match.loseRecord
    ? `(현재 ${match.loseRecord.wins}승 ${match.loseRecord.losses}패)`
    : "";

  return `
경기 정보:
- 날짜: ${date}
- 리그: LCK ${match.blockName}
- 포맷: BO${match.format}
- 승팀: ${match.winnerName} ${winRecordStr}
- 패팀: ${match.loserName} ${loseRecordStr}
- 스코어: ${match.winnerName} ${match.winScore} : ${match.loseScore} ${match.loserName}
- 결과: ${match.winnerName} 승리${match.loseScore === 0 ? " (완승)" : ""}
`.trim();
}
```

---

## 2. 재작성 프롬프트 (`pipeline/article-rewriter.ts` 수정)

기존 `REWRITE_PROMPT`는 일반 게임 뉴스용이라 Esports 경기 결과 기사에 맞는 프롬프트를 별도로 추가한다.

```typescript
// article-rewriter.ts 에 추가

const ESPORTS_REWRITE_PROMPT = `당신은 LCK(리그 오브 레전드 챔피언스 코리아) 현장을 누비는 이스포츠 전문 기자입니다. 
전달받은 경기 결과 데이터를 바탕으로 팬들과 관계자들이 신뢰할 수 있는 '팩트 중심의 속보'를 작성하세요.

[보도 기사 3대 원칙]
1. 데이터 기반 헤드라인: 승패 결과와 스코어를 제목 전면에 배치하여 가독성을 높입니다.
2. 리그 문법 준수: '셧아웃', '풀세트 접전', '연승 가도' 등 이스포츠 전문 용어를 상황에 맞게 구사합니다.
3. 객관적 시각 유지: 특정 팀에 편향되지 않은 중립적인 어조로 사실만을 전달합니다.

[구조 및 문체 지침]
- 제목: [승리 팀명], [상대 팀명] [결과 요약] 구조.
  - 2:0 승리 시: '완파', '셧아웃', '압도' 등의 표현 사용.
  - 2:1 승리 시: '접전 끝 승리', '신승', '역전승' 등의 표현 사용.
  - 예시: "T1, 젠지 셧아웃시키며 단독 선두 탈환" / "DK, 한화생명과 풀세트 접전 끝에 귀중한 1승 추가"
- 요약: 경기 시간, 장소, 핵심 스코어를 포함한 전문적인 한 줄 요약.
- 본문 (2~3문단):
  - 1문단(리드): 경기 일시, 대진, 최종 세트 스코어를 명확히 기술.
  - 2문단(흐름): 이번 승리가 팀의 순위(득실차 포함)나 연승/연패 기록에 미치는 영향 분석.
  - 3문단(전망): 해당 팀의 다음 일정이나 리그 전체 판도에 주는 의미 기술.
- 문체: "~로 확인됐다", "~를 기록했다" 등 단정적이고 힘 있는 기사체 사용.

[주의 사항]
- 제공되지 않은 정보(선수 개인 KDA, 특정 챔피언 활용, 상세 교전 상황 등)는 절대 추측하여 작성하지 마십시오.
- 감정적인 형용사나 낚시성 문구를 배제하십시오.

반드시 아래 JSON 형식으로만 응답하십시오.
{
  "title": "정제된 이스포츠 헤드라인",
  "summary": "핵심 데이터가 포함된 전문 요약",
  "body": "논리적 구조를 갖춘 보도 본문 (문단 구분은 \\n\\n)",
  "tags": ["LCK", "팀명", "경기결과", "이스포츠"]
}`;

// Esports 전용 재작성 함수
export async function rewriteEsportsArticle(
  matchContext: string,
): Promise<RewriteResult> {
  return callClaude(matchContext, ESPORTS_REWRITE_PROMPT);
}
```

---

## 3. 서비스 통합 (`news.service.ts` 수정)

```typescript
// news.service.ts

import {
  fetchCompletedLckMatches,
  buildMatchContext,
} from "./pipeline/esports-collector";
import { rewriteEsportsArticle } from "./pipeline/article-rewriter";

@Injectable()
export class NewsService {
  // 기존 파이프라인 진입점 — 여기에 Esports 추가
  async runNewsPipeline(): Promise<{ saved: number; skipped: number }> {
    let saved = 0;
    let skipped = 0;

    // ── 기존: RSS 파이프라인 ──────────────────────
    for (const source of FEED_SOURCES) {
      const rawArticles = await collectFeed(source);
      for (const article of rawArticles) {
        const result = await this.processRssArticle(article);
        result === "saved" ? saved++ : skipped++;
      }
    }

    // ── 추가: Esports LCK 파이프라인 ─────────────
    const esportsResult = await this.runEsportsPipeline();
    saved += esportsResult.saved;
    skipped += esportsResult.skipped;

    return { saved, skipped };
  }

  // Esports 전용 파이프라인
  async runEsportsPipeline(): Promise<{ saved: number; skipped: number }> {
    let saved = 0;
    let skipped = 0;

    try {
      const matches = await fetchCompletedLckMatches();

      for (const match of matches) {
        // 중복 체크 — matchId 기준
        const originalLink = `lck-match-${match.matchId}`;
        const exists = await this.prisma.news.findUnique({
          where: { originalLink },
        });
        if (exists) {
          skipped++;
          continue;
        }

        // 기사 생성 (분류 없이 LCK 고정)
        const context = buildMatchContext(match);
        const rewritten = await rewriteEsportsArticle(context);

        // DB 저장
        await this.prisma.news.create({
          data: {
            originalTitle: `${match.winnerName} vs ${match.loserName}`,
            originalLink,
            originalPubDate: new Date(match.startTime),
            sourceName: "lolesports",
            mainCategory: "Esports",
            subCategory: "LCK",
            classifyMethod: "fixed",
            rewrittenTitle: rewritten.title,
            rewrittenSummary: rewritten.summary,
            rewrittenBody: rewritten.body,
            tags: rewritten.tags,
            status: "PUBLISHED",
          },
        });

        saved++;
        await new Promise((r) => setTimeout(r, 500)); // 레이트 리밋
      }
    } catch (err) {
      this.logger.error("Esports 파이프라인 실패", err);
    }

    return { saved, skipped };
  }
}
```

---

## 기존 파이프라인과 차이점

| 항목            | RSS 파이프라인    | Esports 파이프라인    |
| --------------- | ----------------- | --------------------- |
| 수집 소스       | RSS 피드 URL      | lolesports API        |
| 카테고리 분류   | 키워드 + Claude   | 고정 (Esports/LCK)    |
| 재작성 프롬프트 | 일반 게임 뉴스용  | 경기 결과 전용        |
| 중복 체크 기준  | 원문 URL          | `lck-match-{matchId}` |
| DB 저장         | 동일              | 동일                  |
| 스케줄러        | 동일 (09/15/21시) | 동일                  |

---

## 스케줄러 동작 흐름

LCK 정규 시즌 경기는 주로 수~일 오후 5시·7시에 진행된다.

```
21:00 스케줄러 실행
  → lolesports API 호출
  → 당일 완료 경기 수신 (오후 5시, 7시 경기 모두 포함)
  → 중복 체크 후 신규 경기만 기사 생성
  → DB 저장
```

경기가 없는 날(월·화)은 완료 경기 중 신규 항목이 없으므로 전부 스킵.

---

## 추가 확장 예정

```
현재:  LCK (롤) 경기 결과 자동 기사화
추후:
  VCT  → 발로란트 이스포츠 API 연동 (PandaScore 또는 동일 구조)
  기타  → 게임메카 RSS Esports 카테고리 기사 재작성으로 보완
```

---

## 체크리스트

```
□ esports-collector.ts 파일 생성
□ ESPORTS_REWRITE_PROMPT article-rewriter.ts 에 추가
□ rewriteEsportsArticle() 함수 추가
□ news.service.ts runNewsPipeline() 에 runEsportsPipeline() 호출 추가
□ 수동 실행 테스트 — 경기 결과 DB 저장 확인
□ originalLink `lck-match-{id}` 형식 중복 체크 확인
□ 팀명 한국어 변환 확인 (TEAM_KO 매핑)
□ 경기 없는 날 전부 스킵 처리 확인
```
