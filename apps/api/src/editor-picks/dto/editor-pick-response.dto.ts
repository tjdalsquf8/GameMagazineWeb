// apps/api/src/editor-picks/dto/editor-pick-response.dto.ts
// 에디터 픽 아티클 응답 DTO — authorId를 제외하고 authorNickname만 노출한다

// Prisma include로 조인된 author 포함 레코드 타입
interface EditorPickWithAuthor {
  id: string
  title: string
  content: string
  mainCategory: string
  thumbnailUrl: string
  isHidden: boolean
  createdAt: Date
  author: {
    nickname: string
  }
}

export class EditorPickResponseDto {
  id!: string
  title!: string
  content!: string
  mainCategory!: string
  thumbnailUrl!: string
  isHidden!: boolean
  authorNickname!: string
  // ISO 8601 문자열로 직렬화
  createdAt!: string

  // Prisma 레코드를 응답 DTO로 변환하는 팩토리 메서드
  static from(record: EditorPickWithAuthor): EditorPickResponseDto {
    const dto = new EditorPickResponseDto()
    dto.id = record.id
    dto.title = record.title
    dto.content = record.content
    dto.mainCategory = record.mainCategory
    dto.thumbnailUrl = record.thumbnailUrl
    dto.isHidden = record.isHidden
    dto.authorNickname = record.author.nickname
    dto.createdAt = record.createdAt.toISOString()
    return dto
  }
}
