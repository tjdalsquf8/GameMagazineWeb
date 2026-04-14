import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Role } from '@prisma/client'

interface AuthUser {
  id: string
  role: Role
}

const COMMENT_AUTHOR_SELECT = {
  id: true,
  nickname: true,
  profileImage: true,
} as const

const DELETED_CONTENT = '삭제된 댓글입니다.'

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name)

  constructor(private readonly prisma: PrismaService) {}

  async findAllByPost(postId: number, userId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true },
    })

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다')
    }

    const allComments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        author: { select: COMMENT_AUTHOR_SELECT },
        _count: { select: { commentRecommends: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            deletedAt: true,
            createdAt: true,
            updatedAt: true,
            author: { select: COMMENT_AUTHOR_SELECT },
            _count: { select: { commentRecommends: true } },
          },
        },
      },
    })

    // 로그인 유저의 댓글/대댓글 추천 여부를 한 번에 조회
    let recommendedCommentIds = new Set<number>()
    if (userId) {
      const allCommentIds = allComments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)])
      const userRecommends = await this.prisma.commentRecommend.findMany({
        where: { userId, commentId: { in: allCommentIds } },
        select: { commentId: true },
      })
      recommendedCommentIds = new Set(userRecommends.map((r) => r.commentId))
    }

    const maskedComments = allComments.map((comment) => ({
      ...comment,
      content: comment.deletedAt ? DELETED_CONTENT : comment.content,
      author: comment.deletedAt ? null : comment.author,
      recommendCount: comment._count.commentRecommends,
      isRecommended: recommendedCommentIds.has(comment.id),
      replies: comment.replies.map((reply) => ({
        ...reply,
        content: reply.deletedAt ? DELETED_CONTENT : reply.content,
        author: reply.deletedAt ? null : reply.author,
        recommendCount: reply._count.commentRecommends,
        isRecommended: recommendedCommentIds.has(reply.id),
      })),
    }))

    const total = await this.prisma.comment.count({
      where: { postId },
    })

    return { items: maskedComments, total }
  }

  /** 댓글 추천 토글 — 이미 추천한 경우 취소, 아닌 경우 추천 추가 */
  async toggleCommentRecommend(postId: number, commentId: number, userId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, postId, deletedAt: null },
      select: { id: true },
    })

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다')
    }

    const existing = await this.prisma.commentRecommend.findUnique({
      where: { userId_commentId: { userId, commentId } },
    })

    if (existing) {
      await this.prisma.commentRecommend.delete({
        where: { userId_commentId: { userId, commentId } },
      })
      this.logger.log(`댓글 추천 취소: commentId=${commentId}, userId=${userId}`)
    } else {
      await this.prisma.commentRecommend.create({
        data: { userId, commentId },
      })
      this.logger.log(`댓글 추천 추가: commentId=${commentId}, userId=${userId}`)
    }

    const recommendCount = await this.prisma.commentRecommend.count({
      where: { commentId },
    })

    return { recommended: !existing, recommendCount }
  }

  async create(postId: number, dto: CreateCommentDto, user: AuthUser) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true },
    })

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다')
    }

    if (dto.parentId !== undefined) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: dto.parentId, postId, deletedAt: null },
        select: { id: true, parentId: true },
      })

      if (!parent) {
        throw new BadRequestException('부모 댓글을 찾을 수 없습니다')
      }

      if (parent.parentId !== null) {
        throw new BadRequestException('대댓글에는 댓글을 달 수 없습니다')
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId,
        authorId: user.id,
        parentId: dto.parentId ?? null,
      },
      select: {
        id: true,
        content: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        parentId: true,
        author: { select: COMMENT_AUTHOR_SELECT },
      },
    })

    this.logger.log(`댓글 작성 완료: commentId=${comment.id}, postId=${postId}, authorId=${user.id}`)
    return comment
  }

  async update(postId: number, commentId: number, dto: UpdateCommentDto, user: AuthUser) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, postId, deletedAt: null },
      select: { id: true, authorId: true },
    })

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다')
    }

    if (comment.authorId !== user.id) {
      throw new ForbiddenException('본인의 댓글만 수정할 수 있습니다')
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      select: {
        id: true,
        content: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        author: { select: COMMENT_AUTHOR_SELECT },
      },
    })

    this.logger.log(`댓글 수정 완료: commentId=${commentId}, authorId=${user.id}`)
    return updated
  }

  async remove(postId: number, commentId: number, user: AuthUser) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, postId, deletedAt: null },
      select: { id: true, authorId: true, replies: { select: { id: true } } },
    })

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다')
    }

    if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('삭제 권한이 없습니다')
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    })

    this.logger.log(`댓글 삭제 완료: commentId=${commentId}, deletedBy=${user.id}`)
    return { success: true, message: '댓글이 삭제되었습니다' }
  }
}
