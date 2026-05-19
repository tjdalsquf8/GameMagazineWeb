// apps/api/src/news/pipeline/esports-collector.ts
// LCK(리그 오브 레전드 챔피언스 코리아) 경기 결과를 Lolesports API에서 수집하여 반환
// API 키는 환경변수(LOLESPORTS_API_KEY)에서 호출 측이 주입 — 소스코드 하드코딩 금지

const LOLESPORTS_BASE = "https://esports-api.lolesports.com/persisted/gw"
const LCK_LEAGUE_ID = "98767991310872058" // LCK 한국 대회
// const WORLD_LEAGUE_ID = "98767975604431411"; // 글로벌 대회

// 팀 영문명 → 한국어명 매핑
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

// LCK 경기 결과 데이터 인터페이스
export interface LckMatch {
  matchId: string;
  blockName: string;
  startTime: string;
  winnerName: string;
  loserName: string;
  winScore: number;
  loseScore: number;
  format: number;
  winRecord?: { wins: number; losses: number };
  loseRecord?: { wins: number; losses: number };
}

// Lolesports API 스케줄 응답 내 이벤트 타입 (실제 응답 구조 기준)
interface LolesportsEvent {
  startTime: string;
  blockName: string;
  state: "completed" | "inProgress" | "unstarted";
  type: string;
  match: {
    id: string;
    strategy: {
      count: number;
      type: string;
    };
    teams: Array<{
      name: string;
      result: {
        outcome: string | null;
        gameWins: number;
      } | null;
      record?: {
        wins: number;
        losses: number;
      };
    }>;
  };
}

// Lolesports API 스케줄 응답 전체 타입
interface LolesportsScheduleResponse {
  data: {
    schedule: {
      events: LolesportsEvent[];
      pages?: {
        older?: string;
        newer?: string;
      };
    };
  };
}

// 팀명을 한국어로 변환 — 매핑에 없으면 원문 그대로 반환
function toKoreanTeamName(name: string): string {
  return TEAM_KO[name] ?? name;
}

// Lolesports API에서 완료된 LCK 경기 목록 수집 후 반환 — apiKey는 호출 측에서 ConfigService로 주입
export async function fetchCompletedLckMatches(apiKey: string): Promise<LckMatch[]> {
  const url = new URL(`${LOLESPORTS_BASE}/getSchedule`)
  url.searchParams.set("hl", "ko-KR")
  url.searchParams.set("leagueId", LCK_LEAGUE_ID)

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Lolesports API 호출 실패: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as LolesportsScheduleResponse
  const events = json.data?.schedule?.events ?? []

  const completedMatches: LckMatch[] = []

  for (const event of events) {
    // match 타입이 아닌 이벤트 스킵
    if (event.type !== 'match') continue

    // 완료된 경기만 처리 — event.state 기준 (실제 API 응답 구조)
    if (event.state !== 'completed') continue

    const { match } = event
    const teams = match.teams
    if (!teams || teams.length < 2) continue

    // 승자 팀 결정 — outcome이 'win'인 팀
    const winnerTeam = teams.find((t) => t.result?.outcome === 'win')
    const loserTeam = teams.find((t) => t.result?.outcome === 'loss')

    if (!winnerTeam || !loserTeam) continue

    completedMatches.push({
      matchId: match.id,
      blockName: event.blockName,
      startTime: event.startTime,
      winnerName: toKoreanTeamName(winnerTeam.name),
      loserName: toKoreanTeamName(loserTeam.name),
      winScore: winnerTeam.result?.gameWins ?? 0,
      loseScore: loserTeam.result?.gameWins ?? 0,
      format: match.strategy.count,
      winRecord: winnerTeam.record
        ? { wins: winnerTeam.record.wins, losses: winnerTeam.record.losses }
        : undefined,
      loseRecord: loserTeam.record
        ? { wins: loserTeam.record.wins, losses: loserTeam.record.losses }
        : undefined,
    })
  }

  return completedMatches
}

// LckMatch 데이터를 Claude 프롬프트에 전달할 텍스트 컨텍스트로 변환
export function buildMatchContext(match: LckMatch): string {
  const scoreLabel =
    match.winScore === match.format
      ? `${match.winScore}:${match.loseScore} (셧아웃)`
      : `${match.winScore}:${match.loseScore} (풀세트 접전)`;

  const winRecordStr = match.winRecord
    ? `${match.winRecord.wins}승 ${match.winRecord.losses}패`
    : "기록 미제공";

  const loseRecordStr = match.loseRecord
    ? `${match.loseRecord.wins}승 ${match.loseRecord.losses}패`
    : "기록 미제공";

  return `경기 블록: ${match.blockName}
경기 일시: ${match.startTime}
승자: ${match.winnerName} (${winRecordStr})
패자: ${match.loserName} (${loseRecordStr})
스코어: ${scoreLabel}
포맷: BO${match.format}`;
}
