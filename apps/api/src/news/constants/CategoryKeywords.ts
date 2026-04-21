// apps/api/src/news/constants/category-keywords.ts
// 마지막 업데이트: 2026-04-19

export type MainCategory = "PC" | "Mobile" | "Console" | "Esports";

export interface SubCategory {
  name: string;
  keywords: string[];
  exclude?: string[];
}

export const SUB_CATEGORIES: Record<MainCategory, SubCategory[]> = {
  // ── PC ───────────────────────────────────────
  PC: [
    {
      name: "리그오브레전드",
      keywords: [
        "리그오브레전드",
        "롤",
        "lol",
        "롤드컵",
        "라이엇",
        "league of legends",
        "2xko",
      ],
    },
    {
      name: "발로란트",
      keywords: ["발로란트", "valorant"],
    },
    {
      name: "오버워치",
      keywords: ["오버워치", "overwatch"],
      exclude: ["오버워치 리그", "overwatch league"],
    },
    {
      name: "배틀그라운드",
      keywords: ["배틀그라운드", "pubg", "battlegrounds"],
      exclude: ["모바일", "mobile"],
    },
    {
      name: "로스트아크",
      keywords: ["로스트아크", "lost ark"],
    },
    {
      name: "메이플스토리",
      keywords: ["메이플스토리"],
      exclude: ["메이플스토리m", "메이플스토리M"],
    },
    {
      name: "던전앤파이터",
      keywords: ["던전앤파이터", "던파", "dnf", "dungeon fighter"],
    },
    {
      name: "디아블로",
      keywords: ["디아블로", "diablo"],
    },
    {
      name: "붉은사막",
      keywords: ["붉은사막"],
    },
  ],

  // ── Mobile ───────────────────────────────────
  Mobile: [
    {
      name: "원신",
      keywords: ["원신", "genshin"],
    },
    {
      name: "붕괴: 스타레일",
      keywords: ["붕괴: 스타레일", "스타레일", "honkai star rail", "star rail"],
    },
    {
      name: "워스텔링",
      keywords: ["워스텔링", "wuthering waves"],
    },
    {
      name: "배틀그라운드 모바일",
      keywords: ["배틀그라운드 모바일", "pubg mobile", "배그 모바일"],
    },
    {
      name: "리니지M",
      keywords: ["리니지m", "리니지M", "lineage m"],
    },
    {
      name: "나혼자만레벨업",
      keywords: ["나혼자만레벨업", "나혼렙", "solo leveling arise"],
    },
    {
      name: "메이플스토리M",
      keywords: ["메이플스토리m", "메이플스토리M"],
    },
    {
      name: "승리의 여신: 니케",
      keywords: ["니케", "nikke", "승리의 여신: 니케"],
    },
  ],

  // ── Console ──────────────────────────────────
  Console: [
    {
      name: "파이널판타지",
      keywords: ["파이널판타지", "final fantasy", "ff7", "ff14", "ff16"],
    },
    {
      name: "GTA",
      keywords: ["gta6", "gta 6", "grand theft auto"],
    },
    {
      name: "젤다",
      keywords: ["젤다", "zelda"],
    },
    {
      name: "몬스터헌터",
      keywords: ["몬스터헌터", "monster hunter"],
    },
    {
      name: "붉은사막",
      keywords: ["붉은사막"],
      exclude: ["pc", "PC", "스팀"], // PC 버전 기사는 PC 카테고리에서 처리
    },
  ],

  // ── Esports ──────────────────────────────────
  Esports: [
    {
      name: "LCK",
      keywords: [
        "lck",
        "t1",
        "젠지",
        "gen.g",
        "kt롤스터",
        "디플러스기아",
        "한화생명",
        "농심레드포스",
      ],
    },
    {
      name: "VCT",
      keywords: ["vct", "valorant champions"],
    },
  ],
};

// 소분류 미매칭 시 대분류 기본값
export const FALLBACKS: Record<MainCategory, string> = {
  PC: "기타 PC",
  Mobile: "기타 모바일",
  Console: "기타 콘솔",
  Esports: "기타 Esports",
};

// 전체 소분류 목록 (프론트 카테고리 메뉴용)
export const CATEGORY_TREE: Record<MainCategory, string[]> = {
  PC: [
    "리그오브레전드",
    "발로란트",
    "오버워치",
    "배틀그라운드",
    "로스트아크",
    "메이플스토리",
    "던전앤파이터",
    "디아블로",
    "붉은사막",
    "기타 PC",
  ],
  Mobile: [
    "원신",
    "붕괴: 스타레일",
    "워스텔링",
    "배틀그라운드 모바일",
    "리니지M",
    "나혼자만레벨업",
    "메이플스토리M",
    "승리의 여신: 니케",
    "기타 모바일",
  ],
  Console: [
    "파이널판타지",
    "GTA",
    "젤다",
    "몬스터헌터",
    "붉은사막",
    "기타 콘솔",
  ],
  Esports: ["LCK", "VCT", "기타 Esports"],
};
