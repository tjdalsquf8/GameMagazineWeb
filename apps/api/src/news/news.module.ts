// apps/api/src/news/news.module.ts
// 뉴스 모듈 — RSS 수집·재작성 파이프라인, 뉴스 CRUD, 스케줄러를 포함

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from '../prisma/prisma.module'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { NewsScheduler } from './news.scheduler'

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [NewsController],
  providers: [NewsService, NewsScheduler],
})
export class NewsModule {}
