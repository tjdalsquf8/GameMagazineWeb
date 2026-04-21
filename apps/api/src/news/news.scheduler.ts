// apps/api/src/news/news.scheduler.ts
// 뉴스 파이프라인 자동 실행 스케줄러 — 매일 09:00, 15:00, 21:00 (KST) 실행

import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NewsService } from "./news.service";

@Injectable()
export class NewsScheduler {
  private readonly logger = new Logger(NewsScheduler.name);

  constructor(private readonly newsService: NewsService) {}

  // 매일 09:00, 15:00, 21:00 (Asia/Seoul) 에 뉴스 파이프라인 자동 실행
  //@Cron('0 9,15,21 * * *', { timeZone: 'Asia/Seoul' })
  async runPipeline(): Promise<void> {
    this.logger.log("스케줄 파이프라인 시작");

    try {
      const result = await this.newsService.runNewsPipeline();
      this.logger.log(
        `스케줄 파이프라인 완료 — saved: ${result.saved}, skipped: ${result.skipped}, failed: ${result.failed}`,
      );
    } catch (err) {
      this.logger.error(
        "스케줄 파이프라인 실패",
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
