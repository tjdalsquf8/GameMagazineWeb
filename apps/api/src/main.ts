import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.use(cookieParser());

  // 모든 라우트에 /api prefix 적용 — 프론트엔드 apiClient 경로 기준과 통일
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
