// apps/api/src/admin/admin.module.ts
// 어드민 모듈 — 대시보드 컨트롤러, 서비스, 가드를 등록한다

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminGuard } from './guards/admin.guard'
import { NewsModule } from '../news/news.module'

@Module({
  imports: [
    // JWT 모듈 — AdminGuard에서 토큰 검증용
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    // CacheModule — AdminService의 CACHE_MANAGER 주입용
    CacheModule.register(),
    // NewsModule — NewsService.runNewsPipeline() 접근용
    NewsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
