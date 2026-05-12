// apps/api/src/editor-picks/editor-picks.service.ts
// 에디터 픽 아티클 서비스 — 생성·목록조회·단건조회·소프트삭제·숨김토글 비즈니스 로직을 담당한다

import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEditorPickDto } from './dto/create-editor-pick.dto'
import { EditorPickResponseDto } from './dto/editor-pick-response.dto'

// sanitize-html 허용 태그 및 속성 설정
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'img', 'a', 'h2', 'h3', 'blockquote'],
  allowedAttributes: {
    img: ['src', 'alt'],
    // javascript: 프로토콜 차단
    a: ['href'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    a: ['http', 'https', 'mailto'],
  },
}

@Injectable()
export class EditorPicksService {
  private readonly logger = new Logger(EditorPicksService.name)

  constructor(private readonly prisma: PrismaService) {}

  // 에디터 픽 아티클 생성 — content를 HTML sanitize 후 저장한다
  async create(dto: CreateEditorPickDto, authorId: string): Promise<EditorPickResponseDto> {
    const sanitizedContent = sanitizeHtml(dto.content ?? '', SANITIZE_OPTIONS)

    const record = await this.prisma.editorPickArticle.create({
      data: {
        title: dto.title,
        content: sanitizedContent,
        mainCategory: dto.mainCategory,
        thumbnailUrl: dto.thumbnailUrl,
        authorId,
      },
      include: {
        author: {
          select: { nickname: true },
        },
      },
    })

    this.logger.log(`에디터 픽 생성 완료: id=${record.id}, authorId=${authorId}`)
    return EditorPickResponseDto.from(record)
  }

  // 에디터 픽 목록 조회 (public) — deletedAt이 null이고 isHidden이 false인 레코드만 반환하며 limit을 최대 20으로 제한한다
  async findAll(limit?: number): Promise<EditorPickResponseDto[]> {
    const take = Math.min(limit ?? 3, 20)

    const records = await this.prisma.editorPickArticle.findMany({
      where: { deletedAt: null, isHidden: false },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        author: {
          select: { nickname: true },
        },
      },
    })

    this.logger.log(`에디터 픽 목록 조회 (public): take=${take}, count=${records.length}`)
    return records.map(EditorPickResponseDto.from)
  }

  // 에디터 픽 목록 조회 (어드민) — isHidden 필터 없이 전체 반환하며 limit을 최대 100으로 제한한다
  async findAllForAdmin(limit?: number): Promise<EditorPickResponseDto[]> {
    const take = Math.min(limit ?? 20, 100)

    const records = await this.prisma.editorPickArticle.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        author: {
          select: { nickname: true },
        },
      },
    })

    this.logger.log(`에디터 픽 목록 조회 (admin): take=${take}, count=${records.length}`)
    return records.map(EditorPickResponseDto.from)
  }

  // 에디터 픽 단건 조회 (public) — deletedAt이 null이고 isHidden이 false인 레코드만 반환한다
  async findOne(id: string): Promise<EditorPickResponseDto> {
    const record = await this.prisma.editorPickArticle.findFirst({
      where: { id, deletedAt: null, isHidden: false },
      include: {
        author: {
          select: { nickname: true },
        },
      },
    })

    if (!record) {
      throw new NotFoundException(`에디터 픽 아티클을 찾을 수 없습니다: id=${id}`)
    }

    this.logger.log(`에디터 픽 단건 조회: id=${id}`)
    return EditorPickResponseDto.from(record)
  }

  // 에디터 픽 숨김 토글 — isHidden 값을 반전시키고 변경된 레코드를 반환한다
  async toggleHidden(id: string): Promise<EditorPickResponseDto> {
    const existing = await this.prisma.editorPickArticle.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existing) {
      throw new NotFoundException(`에디터 픽 아티클을 찾을 수 없습니다: id=${id}`)
    }

    const updated = await this.prisma.editorPickArticle.update({
      where: { id },
      data: { isHidden: !existing.isHidden },
      include: {
        author: {
          select: { nickname: true },
        },
      },
    })

    this.logger.log(`에디터 픽 숨김 토글 완료: id=${id}, isHidden=${updated.isHidden}`)
    return EditorPickResponseDto.from(updated)
  }

  // 에디터 픽 소프트 삭제 — deletedAt을 현재 시각으로 업데이트한다
  async softDelete(id: string): Promise<void> {
    // 존재하지 않거나 이미 삭제된 레코드 검증
    const existing = await this.prisma.editorPickArticle.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existing) {
      throw new NotFoundException(`에디터 픽 아티클을 찾을 수 없습니다: id=${id}`)
    }

    await this.prisma.editorPickArticle.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    this.logger.log(`에디터 픽 소프트 삭제 완료: id=${id}`)
  }
}
