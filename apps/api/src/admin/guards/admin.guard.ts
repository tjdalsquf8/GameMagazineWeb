// apps/api/src/admin/guards/admin.guard.ts
// 어드민 역할(ADMIN) 보유 여부를 검증하는 가드 — JwtAuthGuard 통과 후 role을 확인한다

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

interface JwtPayload {
  sub: string
  role: string
  iat?: number
  exp?: number
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Authorization 헤더에서만 토큰 추출 — JwtAuthGuard와 동일한 방식
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>()

    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('인증 토큰이 없습니다')
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      })

      if (payload.role !== 'ADMIN') {
        throw new ForbiddenException('관리자 권한이 필요합니다')
      }

      request.user = payload
      return true
    } catch (err) {
      if (err instanceof ForbiddenException) throw err
      throw new UnauthorizedException('유효하지 않은 토큰입니다')
    }
  }
}
