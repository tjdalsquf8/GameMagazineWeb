-- ============================
-- Game Magazine - Full Schema v2
-- ============================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================
-- Enums
-- ============================

CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "Provider" AS ENUM ('EMAIL', 'GOOGLE');
CREATE TYPE "NewsStatus" AS ENUM ('PUBLISHED', 'HIDDEN');

-- ============================
-- Tables
-- ============================

-- 유저
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nickname" TEXT NOT NULL,
    "profile_image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "provider" "Provider" NOT NULL DEFAULT 'EMAIL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 이메일 인증
CREATE TABLE "email_verifications" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- 비밀번호 초기화 토큰
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- 커뮤니티 카테고리 (계층형)
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" INTEGER,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- 커뮤니티 게시글
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- 커뮤니티 댓글
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- 게시글 추천
CREATE TABLE "post_recommends" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "post_recommends_pkey" PRIMARY KEY ("id")
);

-- 댓글 추천
CREATE TABLE "comment_recommends" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "comment_id" INTEGER NOT NULL,
    CONSTRAINT "comment_recommends_pkey" PRIMARY KEY ("id")
);

-- 뉴스 추천
CREATE TABLE "news_recommends" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "news_id" TEXT NOT NULL,
    CONSTRAINT "news_recommends_pkey" PRIMARY KEY ("id")
);

-- 뉴스 (자동 수집·재작성 파이프라인)
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "original_link" TEXT NOT NULL,
    "original_pub_date" TIMESTAMP(3),
    "source_name" TEXT NOT NULL,
    "main_category" TEXT NOT NULL,
    "sub_category" TEXT NOT NULL,
    "classify_method" TEXT NOT NULL,
    "rewritten_title" TEXT NOT NULL,
    "rewritten_summary" TEXT NOT NULL,
    "rewritten_body" TEXT NOT NULL,
    "tags" TEXT[],
    "status" "NewsStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- ============================
-- Unique Indexes
-- ============================

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
CREATE UNIQUE INDEX "email_verifications_email_key" ON "email_verifications"("email");
CREATE UNIQUE INDEX "password_reset_tokens_email_key" ON "password_reset_tokens"("email");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "post_recommends_user_id_post_id_key" ON "post_recommends"("user_id", "post_id");
CREATE UNIQUE INDEX "comment_recommends_user_id_comment_id_key" ON "comment_recommends"("user_id", "comment_id");
CREATE UNIQUE INDEX "news_original_link_key" ON "news"("original_link");
CREATE UNIQUE INDEX "news_recommends_user_id_news_id_key" ON "news_recommends"("user_id", "news_id");

-- ============================
-- General Indexes
-- ============================

CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");
CREATE INDEX "posts_category_id_idx" ON "posts"("category_id");
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at" DESC);
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");
CREATE INDEX "post_recommends_post_id_idx" ON "post_recommends"("post_id");
CREATE INDEX "comment_recommends_comment_id_idx" ON "comment_recommends"("comment_id");
CREATE INDEX "news_recommends_news_id_idx" ON "news_recommends"("news_id");
CREATE INDEX "news_main_category_created_at_idx" ON "news"("main_category", "created_at" DESC);
CREATE INDEX "news_sub_category_created_at_idx" ON "news"("sub_category", "created_at" DESC);
CREATE INDEX "news_created_at_idx" ON "news"("created_at" DESC);

-- ============================
-- Foreign Keys
-- ============================

ALTER TABLE "categories"
    ADD CONSTRAINT "categories_parent_id_fkey"
    FOREIGN KEY ("parent_id") REFERENCES "categories"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "posts"
    ADD CONSTRAINT "posts_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "posts"
    ADD CONSTRAINT "posts_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_parent_id_fkey"
    FOREIGN KEY ("parent_id") REFERENCES "comments"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "post_recommends"
    ADD CONSTRAINT "post_recommends_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "post_recommends"
    ADD CONSTRAINT "post_recommends_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comment_recommends"
    ADD CONSTRAINT "comment_recommends_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comment_recommends"
    ADD CONSTRAINT "comment_recommends_comment_id_fkey"
    FOREIGN KEY ("comment_id") REFERENCES "comments"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "news_recommends"
    ADD CONSTRAINT "news_recommends_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "news_recommends"
    ADD CONSTRAINT "news_recommends_news_id_fkey"
    FOREIGN KEY ("news_id") REFERENCES "news"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
