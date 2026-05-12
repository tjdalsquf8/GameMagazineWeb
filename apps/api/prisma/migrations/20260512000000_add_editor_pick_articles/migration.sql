-- CreateTable
CREATE TABLE "editor_pick_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "main_category" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "editor_pick_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "editor_pick_articles_created_at_idx" ON "editor_pick_articles"("created_at" DESC);

-- CreateIndex
CREATE INDEX "editor_pick_articles_author_id_idx" ON "editor_pick_articles"("author_id");

-- AddForeignKey
ALTER TABLE "editor_pick_articles" ADD CONSTRAINT "editor_pick_articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
