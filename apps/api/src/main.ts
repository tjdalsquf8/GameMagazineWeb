import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.use(helmet());
  app.use(cookieParser());

  // 모든 라우트에 /api prefix 적용 — 프론트엔드 apiClient 경로 기준과 통일
  app.setGlobalPrefix('api');

  const isProd = process.env.NODE_ENV === 'production'
  const frontendUrl = process.env.FRONTEND_URL

  if (isProd && !frontendUrl) {
    throw new Error('[CORS] FRONTEND_URL 환경변수가 설정되지 않았습니다. 배포 환경에서는 반드시 설정 필요.')
  }

  app.enableCors({
    origin: frontendUrl ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
