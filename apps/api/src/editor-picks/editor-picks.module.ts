// apps/api/src/editor-picks/editor-picks.module.ts
// 에디터 픽 아티클 모듈 — 컨트롤러, 서비스, AdminGuard를 등록한다

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EditorPicksController } from './editor-picks.controller'
import { EditorPicksService } from './editor-picks.service'
import { AdminGuard } from '../admin/guards/admin.guard'

@Module({
  imports: [
    // AdminGuard 내부에서 JwtService를 사용하므로 등록 필요
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EditorPicksController],
  providers: [EditorPicksService, AdminGuard],
})
export class EditorPicksModule {}
