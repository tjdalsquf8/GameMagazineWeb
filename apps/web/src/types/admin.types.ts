// 어드민 페이지 전용 타입 정의
// 대시보드·파이프라인·기사관리·소스관리에서 공통으로 사용

// ─── 대시보드 통계 ───────────────────────────────────────────────

/** 대시보드 통계 지표 */
export interface AdminStats {
  todayCollected: number
  rewriteSuccessRate: number
  monthlyApiCost: number
  totalArticles: number
  lastCollectedAt: string
  isPipelinePaused: boolean
}

/** 카테고리별 수집량 */
export interface CategoryCollectionCount {
  category: string
  count: number
}

// ─── 파이프라인 ───────────────────────────────────────────────────

/** 파이프라인 실행 로그 상태 */
export type PipelineLogStatus = 'SUCCESS' | 'WARNING' | 'FAILURE' | 'RUNNING'

/** 파이프라인 실행 로그 항목 */
export interface PipelineLog {
  id: string
  status: PipelineLogStatus
  message: string
  saved: number
  skipped: number
  failed: number
  executedAt: string
}

/** 파이프라인 현재 상태 */
export interface PipelineStatus {
  isRunning: boolean
  isPaused: boolean
  lastRunAt: string | null
  nextRunAt: string | null
  schedules: string[]
}

// ─── 소스 ────────────────────────────────────────────────────────

/** 뉴스 소스 언어 */
export type SourceLanguage = 'KO' | 'EN'

/** 뉴스 소스 */
export interface AdminSource {
  id: string
  name: string
  url: string
  language: SourceLanguage
  platform: string | null // PlayStation / Xbox / Nintendo / null
  isActive: boolean
  lastCollectedAt: string | null
  totalCollected: number
}

// ─── 기사 ────────────────────────────────────────────────────────

/** 기사 상태 */
export type ArticleStatus = 'PUBLISHED' | 'HIDDEN' | 'FAILED' | 'PENDING'

/** 기사 분류 방법 */
export type ClassificationMethod = 'AI' | 'MANUAL' | 'RULE'

/** 기사 대분류 카테고리 */
export type MainCategory = 'ALL' | 'PC' | 'MOBILE' | 'CONSOLE' | 'ESPORTS'

/** 어드민 기사 목록 항목 */
export interface AdminArticle {
  id: string
  title: string
  originalTitle: string
  mainCategory: Exclude<MainCategory, 'ALL'>
  subCategory: string
  sourceName: string
  classificationMethod: ClassificationMethod
  status: ArticleStatus
  publishedAt: string
}

/** 기사 목록 조회 필터 */
export interface ArticleFilter {
  mainCategory: MainCategory
  status: ArticleStatus | 'ALL'
  sourceName: string
  page: number
  limit: number
}

// ─── 커뮤니티 게시글 ─────────────────────────────────────────────

/** 어드민 게시글 목록 항목 */
export interface AdminPost {
  id: number
  title: string
  authorNickname: string
  categoryName: string
  categoryId: number
  parentCategoryId: number
  viewCount: number
  commentCount: number
  likeCount: number
  isDeleted: boolean
  createdAt: string
}

/** 게시글 목록 조회 필터 */
export interface PostFilter {
  parentCategoryId: number | 'ALL'
  categoryId: number | 'ALL'
  isDeleted: boolean | 'ALL'
  keyword: string
  page: number
  limit: number
}

// ─── 신고 ─────────────────────────────────────────────────────────

/** 신고 상태 */
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED'

/** 신고 대상 타입 */
export type ReportTargetType = 'POST' | 'COMMENT'

/** 정지 기간 */
export type BanDuration = '7d' | '30d' | 'permanent'

/** 피신고자 정지 이력 (기간별 횟수) */
export interface BanHistory {
  '7d': number
  '30d': number
  permanent: number
}

/** 어드민 신고 목록 항목 */
export interface AdminReport {
  id: string
  targetType: ReportTargetType
  targetId: number
  targetPreview: string
  reporterNickname: string
  reason: string
  status: ReportStatus
  createdAt: string
  /** 피신고자 유저 ID (백엔드 구현 완료 후 반환) */
  targetAuthorId?: string
  /** 피신고자 닉네임 (백엔드 구현 완료 후 반환) */
  targetAuthorNickname?: string
  /** 피신고자 정지 이력 (백엔드 구현 완료 후 반환) */
  banHistory?: BanHistory
}
