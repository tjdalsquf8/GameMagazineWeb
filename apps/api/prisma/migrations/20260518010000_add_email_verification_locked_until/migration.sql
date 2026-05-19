-- AlterTable: email_verifications에 locked_until 컬럼 추가 (5회 실패 시 잠금 해제 시각)
ALTER TABLE "email_verifications" ADD COLUMN "locked_until" TIMESTAMP(3);
