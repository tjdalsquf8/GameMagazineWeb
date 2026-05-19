// PrismaService — NestJS DI용 PrismaClient 래퍼. 운영 환경에서는 error 레벨만 로깅해 민감 데이터 노출 방지.
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/** 운영/개발 여부에 따라 Prisma 쿼리 로그 레벨을 제한한다 */
const isProd = process.env.NODE_ENV === 'production'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: isProd ? ['error'] : ['warn', 'error'],
    })
  }

  /** 모듈 초기화 시 DB 연결 */
  async onModuleInit() {
    await this.$connect()
  }

  /** 모듈 종료 시 DB 연결 해제 */
  async onModuleDestroy() {
    await this.$disconnect()
  }
}
