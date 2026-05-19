-- CreateTable
CREATE TABLE "ban_histories" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banned_until" TIMESTAMP(3),

    CONSTRAINT "ban_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ban_histories_user_id_idx" ON "ban_histories"("user_id");

-- AddForeignKey
ALTER TABLE "ban_histories" ADD CONSTRAINT "ban_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
