// posts.service.ts
// 게시글 CRUD 및 조회수 증가 비즈니스 로직을 담당하는 서비스

import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostQueryDto, PostSortOption } from "./dto/post-query.dto";
import { Role } from "@prisma/client";
import { Prisma } from "@prisma/client";

interface AuthUser {
  id: string;
  role: Role;
}

const POST_AUTHOR_SELECT = {
  id: true,
  nickname: true,
  profileImage: true,
} as const;

const POST_CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
} as const;

const POST_BASE_SELECT = {
  id: true,
  title: true,
  content: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  author: { select: POST_AUTHOR_SELECT },
  category: { select: POST_CATEGORY_SELECT },
  _count: { select: { comments: true, postRecommends: true } },
} as const;

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** 게시글 목록 조회 (페이지네이션, 필터, 정렬 지원) */
  async findAll(query: PostQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search) {
      where.title = { contains: query.search, mode: "insensitive" };
    }

    let orderBy:
      | Prisma.PostOrderByWithRelationInput
      | Prisma.PostOrderByWithRelationInput[];

    switch (query.sort) {
      case PostSortOption.POPULAR:
        orderBy = { viewCount: "desc" };
        break;
      case PostSortOption.COMMENTS:
        orderBy = { comments: { _count: "desc" } };
        break;
      case PostSortOption.LATEST:
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: POST_BASE_SELECT,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /** 게시글 단건 조회 (조회수 증가 없음 — 순수 조회만 수행, userId 있으면 isRecommended 포함) */
  async findOne(postId: number, userId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: {
        ...POST_BASE_SELECT,
        _count: { select: { comments: true, postRecommends: true } },
      },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다");
    }

    const isRecommended = userId
      ? (await this.prisma.postRecommend.findUnique({
          where: { userId_postId: { userId, postId } },
        })) !== null
      : false;

    return {
      ...post,
      recommendCount: post._count.postRecommends,
      isRecommended,
    };
  }

  /** 조회수 증가 전용 메서드 — POST /posts/:id/view 에서 호출 */
  async incrementView(postId: number) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다");
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });

    this.logger.log(`조회수 증가: postId=${postId}`);
    return { success: true };
  }

  /** 게시글 추천 토글 — 이미 추천한 경우 취소, 아닌 경우 추천 추가 */
  async togglePostRecommend(postId: number, userId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다");
    }

    const existing = await this.prisma.postRecommend.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.postRecommend.delete({
        where: { userId_postId: { userId, postId } },
      });
      this.logger.log(`게시글 추천 취소: postId=${postId}, userId=${userId}`);
    } else {
      await this.prisma.postRecommend.create({
        data: { userId, postId },
      });
      this.logger.log(`게시글 추천 추가: postId=${postId}, userId=${userId}`);
    }

    const recommendCount = await this.prisma.postRecommend.count({
      where: { postId },
    });

    return { recommended: !existing, recommendCount };
  }

  /** 게시글 생성 */
  async create(dto: CreatePostDto, user: AuthUser) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException("존재하지 않는 카테고리입니다");
    }

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        categoryId: dto.categoryId,
        authorId: user.id,
      },
      select: POST_BASE_SELECT,
    });

    this.logger.log(`게시글 작성 완료: postId=${post.id}, authorId=${user.id}`);
    return post;
  }

  /** 게시글 수정 (본인만 가능) */
  async update(postId: number, dto: UpdatePostDto, user: AuthUser) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true, authorId: true },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다");
    }

    if (post.authorId !== user.id) {
      throw new ForbiddenException("본인의 게시글만 수정할 수 있습니다");
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
      },
      select: POST_BASE_SELECT,
    });

    this.logger.log(`게시글 수정 완료: postId=${postId}, authorId=${user.id}`);
    return updated;
  }

  /** 게시글 삭제 (본인 또는 ADMIN만 가능, soft delete) */
  async remove(postId: number, user: AuthUser) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true, authorId: true },
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다");
    }

    if (post.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException("삭제 권한이 없습니다");
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`게시글 삭제 완료: postId=${postId}, deletedBy=${user.id}`);
    return { success: true, message: "게시글이 삭제되었습니다" };
  }
}
