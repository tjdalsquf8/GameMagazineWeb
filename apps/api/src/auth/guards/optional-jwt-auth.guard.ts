// optional-jwt-auth.guard.ts
// JWT 토큰이 있으면 유저 정보를 req.user에 주입하고, 없어도 요청을 통과시키는 선택적 인증 Guard

import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /** 인증 실패 시 예외를 던지지 않고 요청을 그대로 통과시킨다 */
  handleRequest<TUser>(_err: unknown, user: TUser): TUser {
    // 유저가 없으면 undefined 반환 — 예외 발생 없음
    return user
  }

  /** 토큰이 없는 경우에도 canActivate가 true를 반환하도록 오버라이드 */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context)
    } catch {
      // 토큰 없음 또는 유효하지 않은 토큰 — 무시하고 계속 진행
    }
    return true
  }
}
