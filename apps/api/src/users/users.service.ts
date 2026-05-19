// users/users.service.ts
// 마이페이지 관련 비즈니스 로직 — 프로필 조회/수정, 게시글/댓글/좋아요 목록, 회원 탈퇴

import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateNicknameDto } from './dto/update-nickname.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateProfileImageDto } from './dto/update-profile-image.dto'
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { DeleteAccountDto } from './dto/delete-account.dto'
import * as bcrypt from 'bcrypt'

/** 프로필 응답에 사용할 User select */
const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  nickname: true,
  role: true,
  provider: true,
  profileImage: true,
  createdAt: true,
  updatedAt: true,
} as const

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /** 내 프로필 조회 — 게시글/댓글/좋아요 카운트 포함 */
  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...USER_PROFILE_SELECT,
        _count: {
          select: {
            posts: { where: { deletedAt: null } },
            comments: { where: { deletedAt: null } },
            postLikes: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다')
    }

    return {
      ...user,
      _count: {
        posts: user._count.posts,
        comments: user._count.comments,
        likes: user._count.postLikes,
      },
    }
  }

  /** 닉네임 변경 */
  async updateNickname(userId: string, dto: UpdateNicknameDto) {
    const existing = await this.prisma.user.findFirst({
      where: { nickname: dto.nickname, NOT: { id: userId } },
      select: { id: true },
    })

    if (existing) {
      throw new ConflictException('이미 사용 중인 닉네임입니다')
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { nickname: dto.nickname },
      select: {
        ...USER_PROFILE_SELECT,
        _count: {
          select: {
            posts: { where: { deletedAt: null } },
            comments: { where: { deletedAt: null } },
            postLikes: true,
          },
        },
      },
    })

    this.logger.log(`닉네임 변경 완료: userId=${userId}`)

    return {
      ...user,
      _count: {
        posts: user._count.posts,
        comments: user._count.comments,
        likes: user._count.postLikes,
      },
    }
  }

  /** 프로필 이미지 변경 — R2 업로드 완료 후 공개 URL을 DB에 저장, R2 도메인 화이트리스트 검증 포함 */
  async updateProfileImage(userId: string, dto: UpdateProfileImageDto) {
    // profileImage가 존재할 때만 도메인 검증 수행 (null/undefined → 이미지 제거 허용)
    if (dto.profileImage != null) {
      const r2PublicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL')
      if (!dto.profileImage.startsWith(r2PublicUrl)) {
        throw new BadRequestException('허용되지 않는 이미지 URL입니다')
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: dto.profileImage ?? null },
      select: USER_PROFILE_SELECT,
    })

    this.logger.log(`프로필 이미지 변경 완료: userId=${userId}`)
    return user
  }

  /** 비밀번호 변경 — 현재 비밀번호 검증 후 변경 */
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    })

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다')
    }

    if (!user.password) {
      throw new UnauthorizedException('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다')
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password)
    if (!isValid) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다')
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12)

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    // 비밀번호 변경 시 기존 세션 전체 무효화
    await this.prisma.refreshToken.deleteMany({ where: { userId } })

    this.logger.log(`비밀번호 변경 완료: userId=${userId}`)
    return { message: '비밀번호가 변경되었습니다.' }
  }

  /** 내 게시글 목록 조회 (페이지네이션) */
  async getMyPosts(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where = { authorId: userId, deletedAt: null }

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          viewCount: true,
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true, postRecommends: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /** 내가 쓴 댓글 목록 조회 (페이지네이션) */
  async getMyComments(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where = { authorId: userId, deletedAt: null }

    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { commentRecommends: true } },
          post: { select: { id: true, title: true } },
        },
      }),
      this.prisma.comment.count({ where }),
    ])

    const mappedItems = items.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      recommendCount: c._count.commentRecommends,
      post: c.post,
    }))

    return {
      items: mappedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /** 좋아요(추천)한 게시글 목록 조회 (페이지네이션) */
  async getMyLikes(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where = { userId }

    const [items, total] = await Promise.all([
      this.prisma.postLike.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          post: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              category: { select: { id: true, name: true, slug: true } },
              _count: { select: { comments: true, postRecommends: true } },
            },
          },
        },
      }),
      this.prisma.postLike.count({ where }),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /** 최근 읽은 뉴스 목록 조회 — DB 미구현, 빈 목록 반환 */
  async getNewsHistory(_userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20

    this.logger.log('뉴스 히스토리 기능은 아직 구현되지 않았습니다')

    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  /** 알림 설정 변경 — DB 미구현, 요청값 그대로 반환 */
  async updateNotificationSettings(
    _userId: string,
    settings: { postComment?: boolean; lckResult?: boolean; marketing?: boolean },
  ) {
    this.logger.log('알림 설정 기능은 아직 구현되지 않았습니다')

    return {
      postComment: settings.postComment ?? false,
      lckResult: settings.lckResult ?? false,
      marketing: settings.marketing ?? false,
    }
  }

  /** 회원 탈퇴 — 비밀번호 재확인 후 관련 데이터 cascade 삭제 */
  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, provider: true },
    })

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다')
    }

    // 소셜 로그인 계정은 비밀번호 없음 — 별도 처리 없이 탈퇴 허용
    if (user.password) {
      const isValid = await bcrypt.compare(dto.password, user.password)
      if (!isValid) {
        throw new UnauthorizedException('비밀번호가 올바르지 않습니다')
      }
    }

    await this.prisma.user.delete({
      where: { id: userId },
    })

    this.logger.log(`회원 탈퇴 완료: userId=${userId}`)
    return { message: '탈퇴가 완료되었습니다.' }
  }
}
