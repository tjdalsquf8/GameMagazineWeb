import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'

interface JwtPayload {
  sub: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: import('express').Request) => req?.cookies?.['accessToken'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: false,
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        provider: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        isBanned: true,
        bannedUntil: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다')
    }

    if (user.isBanned) {
      const isExpired = user.bannedUntil && user.bannedUntil < new Date()
      if (!isExpired) {
        const message = user.bannedUntil
          ? `계정이 ${user.bannedUntil.toLocaleDateString('ko-KR')}까지 정지되었습니다`
          : '계정이 영구 정지되었습니다'
        throw new ForbiddenException(message)
      }

      // 정지 기간 만료 시 DB도 자동 업데이트
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isBanned: false, bannedUntil: null, banReason: null },
      })
    }

    const { isBanned: _, bannedUntil: __, ...safeUser } = user
    return safeUser
  }
}
