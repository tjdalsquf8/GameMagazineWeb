// apps/api/src/news/pipeline/article-rewriter.ts
// 원문 기사를 Claude API를 통해 게임 매거진 스타일로 재작성
// JSON 파싱 실패 시 원본 응답 앞 500자를 로그에 기록하여 디버깅 지원

import Anthropic from "@anthropic-ai/sdk"
import { Logger } from "@nestjs/common"

// 모듈 전역 Logger 인스턴스 — 파이프라인 함수에서 공통 사용
const logger = new Logger('ArticleRewriter')

// 재작성 결과 인터페이스
export interface RewriteResult {
  title: string;
  summary: string;
  body: string;
  tags: string[];
}

// Claude API 응답 JSON 타입
interface RewriteResponseJson {
  title: string;
  summary: string;
  body: string;
  tags: string[];
}

const GAME_REWRITE_PROMPT = `당신은 게임 매거진의 전문 편집자입니다.

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
}`;

// 이스포츠 경기 결과 기사 작성용 프롬프트 — 팩트 중심 속보 작성 지침
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

// Esports 경기 결과 컨텍스트를 Claude API로 전달해 기사로 재작성하여 반환
export async function rewriteEsportsArticle(
  matchContext: string,
  anthropic: Anthropic,
): Promise<RewriteResult> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: ESPORTS_REWRITE_PROMPT,
    messages: [
      {
        role: "user",
        content: matchContext,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    logger.error(`Claude 이스포츠 재작성 JSON 파싱 실패 — 원본 응답: ${responseText.slice(0, 500)}`)
    throw new Error("Claude 이스포츠 재작성 응답에서 JSON을 찾을 수 없습니다.")
  }

  const parsed = JSON.parse(jsonMatch[0]) as RewriteResponseJson;

  return {
    title: parsed.title ?? "",
    summary: parsed.summary ?? "",
    body: parsed.body ?? "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  };
}

// Console 플랫폼(영문) 기사 재작성용 프롬프트 — 영문 원문을 한국어 게임 매거진 스타일로 변환
const CONSOLE_REWRITE_PROMPT = `당신은 글로벌 콘솔 게임 시장의 흐름을 꿰뚫고 있는 콘솔 매거진 수석 에디터입니다.
해외 영문 뉴스를 바탕으로 국내 콘솔 유저들의 니즈에 최적화된 '전문 분석 기사'를 작성하세요.

[보도 기사 작성 3대 원칙]
1. 현지화(Localization): 영문 직역 투를 철저히 배제하고, 국내 게임 커뮤니티에서 통용되는 전문 용어(프레임 드랍, 레이 트레이싱, 독점작 등)를 사용합니다.
2. 하드웨어-소프트웨어 연결: 단순 게임 출시 소식을 넘어, 해당 게임이 구동되는 플랫폼(PS5, Xbox, Switch 등)의 특성 및 구독 서비스(Game Pass, PS Plus)와의 연관성을 짚어줍니다.
3. 명확한 가이드: 국내 유저들이 가장 궁금해하는 '한국어 지원 여부', '정식 출시 가격', '구매 플랫폼' 정보를 기사 말미에 명확히 배치합니다.

[구조 및 문체 지침]
- 제목: [플랫폼명] + [게임명/이벤트] + [핵심 변화].
  - 예시: "PlayStation 5 Pro, 신규 펌웨어 업데이트로 'PSSR' 업스케일링 성능 대폭 개선"
  - 예시: "Xbox Game Pass, 5월 라인업 공개... '세누아의 전설' 포함 대작 3종 합류"
- 요약: 글로벌 시장의 반응과 국내 유저가 얻을 실익을 담은 전문적인 한 줄 요약.
- 본문 (3~4문단):
  - 1문단(리드): 해외에서 발생한 핵심 이슈를 국내 시각으로 재해석하여 보도.
  - 2문단(상세): 기기 성능 향상 수치, 신규 시스템 도입, 업데이트 용량 등 기술적 상세 데이터 서술.
  - 3문단(맥락): 해당 이슈가 플랫폼 홀더(소니, 마이크로소프트, 닌텐도)의 전략이나 향후 메타에 주는 의미 분석.
  - 4문단(가이드): 국내 정식 발매 가격(원화 환산 권장), 한국어 자막 지원 여부, 출시 일정을 정확히 명시.

[문체 및 금기 사항]
- "~인 것 같다", "~라고 한다" 대신 "~로 확인됐다", "~를 공식 발표했다" 등 권위 있는 어조 사용.
- 고유명사 표기: Xbox, PlayStation, Nintendo Switch 등 브랜드명은 영문 표기를 원칙으로 함.
- 원문 문장을 번역기에 돌린 듯한 어색한 문장 구조 절대 금지.

반드시 아래 JSON 형식으로만 응답하십시오.
{
  "title": "국내 정서에 맞춘 전문 콘솔 헤드라인",
  "summary": "핵심을 관통하는 전문적인 뉴스 요약",
  "body": "기술적 분석과 가이드가 포함된 본문 (문단 구분은 \\n\\n)",
  "tags": ["플랫폼명", "게임명", "하드웨어/소프트웨어", "글로벌뉴스"]
}`;

// Console 플랫폼 영문 기사를 Claude API로 한국어로 재작성하여 반환
export async function rewriteConsoleArticle(
  title: string,
  content: string,
  platform: string,
  anthropic: Anthropic,
): Promise<RewriteResult> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: CONSOLE_REWRITE_PROMPT,
    messages: [
      {
        role: "user",
        content: `플랫폼: Console > ${platform}\n\n원문 제목: ${title}\n\n원문 내용:\n${content}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    logger.error(`Claude Console 재작성 JSON 파싱 실패 — 원본 응답: ${responseText.slice(0, 500)}`)
    throw new Error("Claude Console 재작성 응답에서 JSON을 찾을 수 없습니다.")
  }

  const parsed = JSON.parse(jsonMatch[0]) as RewriteResponseJson;

  return {
    title: parsed.title ?? title,
    summary: parsed.summary ?? "",
    body: parsed.body ?? "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  };
}

// 원문 기사를 Claude API를 이용해 게임 매거진 스타일로 재작성하여 반환
export async function rewriteArticle(
  title: string,
  content: string,
  mainCategory: string,
  subCategory: string,
  anthropic: Anthropic,
): Promise<RewriteResult> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: GAME_REWRITE_PROMPT,
    messages: [
      {
        role: "user",
        content: `카테고리: ${mainCategory} > ${subCategory}

제목: ${title}

본문:
${content}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    logger.error(`Claude 재작성 JSON 파싱 실패 — 원본 응답: ${responseText.slice(0, 500)}`)
    throw new Error("Claude 재작성 응답에서 JSON을 찾을 수 없습니다.")
  }

  const parsed = JSON.parse(jsonMatch[0]) as RewriteResponseJson;

  return {
    title: parsed.title ?? title,
    summary: parsed.summary ?? "",
    body: parsed.body ?? "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  };
}
