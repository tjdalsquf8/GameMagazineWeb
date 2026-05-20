// 뉴스 조회수 전용 Throttle Guard — IP + newsId 조합 키로 뉴스별 독립 제한
// 기본 ThrottlerGuard는 IP만 키로 사용해 A뉴스 조회 시 B뉴스도 차단되는 문제가 있음

import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import type { Request } from 'express'

@Injectable()
export class NewsViewThrottleGuard extends ThrottlerGuard {
  // IP + newsId 조합을 키로 사용해 뉴스마다 독립적으로 제한
  protected async getTracker(req: Request): Promise<string> {
    const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown'
    const newsId = (req.params as Record<string, string>)['id'] ?? ''
    return `news-view:${ip}:${newsId}`
  }
}
