-- 회원 탈퇴 시 게시글/댓글 익명화 처리
-- Post.authorId: nullable + onDelete SetNull
-- Comment.authorId: nullable + onDelete SetNull
-- PostLike.userId: onDelete Cascade 추가

-- Post.author_id: NOT NULL → nullable
ALTER TABLE "posts" ALTER COLUMN "author_id" DROP NOT NULL;

-- Post 기존 FK 제거 후 onDelete SetNull으로 재생성
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_author_id_fkey";
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Comment.author_id: NOT NULL → nullable
ALTER TABLE "comments" ALTER COLUMN "author_id" DROP NOT NULL;

-- Comment 기존 FK 제거 후 onDelete SetNull으로 재생성
ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_author_id_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PostLike 기존 FK 제거 후 onDelete Cascade로 재생성
ALTER TABLE "post_likes" DROP CONSTRAINT IF EXISTS "post_likes_user_id_fkey";
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
