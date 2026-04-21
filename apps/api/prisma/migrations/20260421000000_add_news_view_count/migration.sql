-- AlterTable: news 테이블에 view_count 컬럼 추가
ALTER TABLE "news" ADD COLUMN "view_count" INTEGER NOT NULL DEFAULT 0;
