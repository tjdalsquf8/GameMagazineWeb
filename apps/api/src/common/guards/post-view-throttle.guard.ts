// 커뮤니티 게시글 조회수 전용 Throttle Guard — IP + postId 조합 키로 게시글별 독립 제한
// 기본 ThrottlerGuard는 IP만 키로 사용해 A게시글 조회 시 B게시글도 차단되는 문제가 있음

import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import type { Request } from 'express'

// [SECURITY] Rate Limiting - 브루트포스/DoS 방어
// 전역: 10req/60s, 뉴스 조회수: IP+ID 24시간 1회, 이메일: 3회/5분
@Injectable()
export class PostViewThrottleGuard extends ThrottlerGuard {
  // IP + postId 조합을 키로 사용해 게시글마다 독립적으로 제한
  protected async getTracker(req: Request): Promise<string> {
    const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown'
    const postId = (req.params as Record<string, string>)['postId'] ?? ''
    return `post-view:${ip}:${postId}`
  }
}
