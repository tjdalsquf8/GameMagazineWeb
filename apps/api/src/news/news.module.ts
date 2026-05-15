// apps/api/src/news/news.module.ts
// 뉴스 모듈 — RSS 수집·재작성 파이프라인, 뉴스 CRUD, 스케줄러를 포함

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { NewsScheduler } from './news.scheduler'
import { AdminGuard } from '../admin/guards/admin.guard'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    // AdminGuard 내부에서 JwtService를 사용하므로 등록 필요
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsScheduler, AdminGuard],
  exports: [NewsService],
})
export class NewsModule {}
