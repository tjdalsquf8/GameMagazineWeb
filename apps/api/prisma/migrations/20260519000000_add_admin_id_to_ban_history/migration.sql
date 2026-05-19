-- AlterTable: BanHistory에 adminId 필드 추가 — 기존 데이터 호환을 위해 nullable
ALTER TABLE "ban_histories" ADD COLUMN "admin_id" TEXT;

-- CreateIndex: admin_id 인덱스 추가
CREATE INDEX "ban_histories_admin_id_idx" ON "ban_histories"("admin_id");
