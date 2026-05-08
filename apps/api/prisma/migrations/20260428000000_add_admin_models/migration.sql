-- 어드민 대시보드 관련 모델 추가 마이그레이션
-- User: isBanned, bannedUntil, banReason, lastLoginAt 필드 추가
-- Post: status 필드 추가
-- Comment: isHidden 필드 추가
-- 추가: PipelineLog, NewsSource, NewsCategory, Report 모델

-- User 테이블에 어드민 관련 필드 추가
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_banned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banned_until" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ban_reason" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP(3);

-- Post 테이블에 status 필드 추가
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PUBLISHED';

-- Comment 테이블에 isHidden 필드 추가
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- PipelineLog 테이블 생성
CREATE TABLE IF NOT EXISTS "pipeline_logs" (
  "id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "saved_count" INTEGER NOT NULL DEFAULT 0,
  "skipped_count" INTEGER NOT NULL DEFAULT 0,
  "failed_count" INTEGER NOT NULL DEFAULT 0,
  "run_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pipeline_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "pipeline_logs_run_at_idx" ON "pipeline_logs"("run_at" DESC);

-- NewsSource 테이블 생성
CREATE TABLE IF NOT EXISTS "news_sources" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "platform" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "last_fetch_at" TIMESTAMP(3),
  "last_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "news_sources_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "news_sources_url_key" ON "news_sources"("url");

-- NewsCategory 테이블 생성
CREATE TABLE IF NOT EXISTS "news_categories" (
  "id" TEXT NOT NULL,
  "main_category" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "keywords" TEXT[] NOT NULL DEFAULT '{}',
  "excludes" TEXT[] NOT NULL DEFAULT '{}',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "news_categories_main_category_name_key" ON "news_categories"("main_category", "name");
CREATE INDEX IF NOT EXISTS "news_categories_main_category_is_active_idx" ON "news_categories"("main_category", "is_active");

-- Report 테이블 생성
CREATE TABLE IF NOT EXISTS "reports" (
  "id" SERIAL NOT NULL,
  "type" TEXT NOT NULL,
  "target_id" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "reporter_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "reports_status_created_at_idx" ON "reports"("status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "reports_reporter_id_idx" ON "reports"("reporter_id");

ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey"
  FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
