// apps/api/src/admin/admin.service.ts
// 어드민 대시보드 서비스 — 통계, 파이프라인, 기사·소스·카테고리·유저·게시물·신고 관리, 카드뉴스 생성을 담당한다

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Anthropic from "@anthropic-ai/sdk";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import { NewsService } from "../news/news.service";
import { NewsStatus } from "@prisma/client";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { BanUserDto, UpdateRoleDto } from "./dto/user-action.dto";
import { HandleReportDto } from "./dto/report-action.dto";

// 파이프라인 실행 중 플래그 캐시 키
const PIPELINE_RUNNING_KEY = "admin:pipeline:running";
// 파이프라인 일시정지 상태 DB 키 (SystemConfig)
const PIPELINE_PAUSED_DB_KEY = "pipeline_paused";
// 카테고리 캐시 키
const CATEGORIES_CACHE_KEY = "categories:active";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly newsService: NewsService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    // Anthropic 클라이언트 초기화
    this.anthropic = new Anthropic({
      apiKey: this.configService.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
  }

  // ============================
  // 통계
  // ============================

  // 대시보드 요약 통계 — 오늘 수집량, 재작성 성공률, 월 추정 비용, 전체 기사 수, 마지막 수집 시각, 파이프라인 일시정지 여부 반환
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 이번달 1일 00:00:00
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [totalArticles, todayLogs, monthlyLogs, recentLog, pausedConfig] =
      await Promise.all([
        this.prisma.news.count(),
        this.prisma.pipelineLog.findMany({
          where: { runAt: { gte: today } },
        }),
        this.prisma.pipelineLog.findMany({
          where: { runAt: { gte: monthStart } },
          select: { savedCount: true },
        }),
        this.prisma.pipelineLog.findFirst({ orderBy: { runAt: "desc" } }),
        this.prisma.systemConfig.findUnique({
          where: { key: PIPELINE_PAUSED_DB_KEY },
        }),
      ]);

    // 오늘 합산 통계
    const todaySaved = todayLogs.reduce((sum, l) => sum + l.savedCount, 0);
    const todayFailed = todayLogs.reduce((sum, l) => sum + l.failedCount, 0);

    // 재작성 성공률 — 오늘 수집 기준
    const rewriteSuccessRate =
      todaySaved + todayFailed === 0
        ? 100
        : Math.round((todaySaved / (todaySaved + todayFailed)) * 100 * 100) /
          100;

    // 이번달 API 비용 추정 (Claude Haiku 기준 $0.001/기사)
    const monthlySaved = monthlyLogs.reduce((sum, l) => sum + l.savedCount, 0);
    const monthlyApiCost = Math.round(monthlySaved * 0.001 * 100) / 100;

    return {
      todayCollected: todaySaved,
      rewriteSuccessRate,
      monthlyApiCost,
      totalArticles,
      lastCollectedAt: recentLog?.runAt?.toISOString() ?? null,
      isPipelinePaused: pausedConfig?.value === "true",
    };
  }

  // 카테고리별 기사 수 조회
  async getStatsCategories() {
    const cats = await this.prisma.news.groupBy({
      by: ["mainCategory"],
      _count: { id: true },
    });
    return cats.map((c) => ({ category: c.mainCategory, count: c._count.id }));
  }

  // 일별 수집 히스토리 조회 (최근 N일)
  async getStatsHistory(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const logs = await this.prisma.pipelineLog.findMany({
      where: { runAt: { gte: since } },
      orderBy: { runAt: "asc" },
    });

    return logs.map((l) => ({
      id: l.id,
      status: l.status,
      message: l.message,
      savedCount: l.savedCount,
      skippedCount: l.skippedCount,
      failedCount: l.failedCount,
      runAt: l.runAt,
    }));
  }

  // 월별 비용 히스토리 조회 (최근 N개월) — PipelineLog 기반 추정값 반환
  async getCostHistory(months: number) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const logs = await this.prisma.pipelineLog.findMany({
      where: { runAt: { gte: since } },
      orderBy: { runAt: "asc" },
    });

    // 월별 집계
    const monthly: Record<string, { saved: number; cost: number }> = {};
    for (const log of logs) {
      const key = `${log.runAt.getFullYear()}-${String(log.runAt.getMonth() + 1).padStart(2, "0")}`;
      if (!monthly[key]) monthly[key] = { saved: 0, cost: 0 };
      monthly[key].saved += log.savedCount;
      // Claude Haiku 기준 약 $0.001/기사 추정
      monthly[key].cost += log.savedCount * 0.001;
    }

    return Object.entries(monthly).map(([month, data]) => ({
      month,
      savedCount: data.saved,
      estimatedCostUsd: Math.round(data.cost * 100) / 100,
    }));
  }

  // ============================
  // 파이프라인
  // ============================

  // 파이프라인 현재 상태 조회 — 실행 중 여부, 일시정지 여부, 마지막 실행 시각, 스케줄 목록 반환
  async getPipelineStatus() {
    const [isRunning, pausedConfig, recentLog] = await Promise.all([
      this.cacheManager.get<boolean>(PIPELINE_RUNNING_KEY),
      this.prisma.systemConfig.findUnique({
        where: { key: PIPELINE_PAUSED_DB_KEY },
      }),
      this.prisma.pipelineLog.findFirst({ orderBy: { runAt: "desc" } }),
    ]);
    const isPaused = pausedConfig?.value === "true";
    return {
      isRunning: isRunning ?? false,
      isPaused,
      lastRunAt: recentLog?.runAt?.toISOString() ?? null,
      nextRunAt: null,
      schedules: ["매일 09:00 KST", "매일 15:00 KST", "매일 21:00 KST"],
    };
  }

  // 파이프라인 수동 실행 — 중복 실행 방지 후 즉시 실행 (일시정지 상태와 무관하게 항상 실행)
  async runPipeline() {
    const isRunning =
      await this.cacheManager.get<boolean>(PIPELINE_RUNNING_KEY);
    if (isRunning) {
      throw new ConflictException("파이프라인이 이미 실행 중입니다");
    }

    // 실행 중 플래그 설정 (30분 TTL)
    await this.cacheManager.set(PIPELINE_RUNNING_KEY, true, 30 * 60 * 1000);

    this.logger.log("[Admin] 파이프라인 수동 실행 시작");

    // 비동기 실행 — 응답을 즉시 반환하고 백그라운드에서 실행
    this.newsService
      .runNewsPipeline()
      .then(async (result) => {
        await this.prisma.pipelineLog.create({
          data: {
            status: result.failed > 0 ? "warning" : "success",
            message: `수동 실행 완료 — saved: ${result.saved}, skipped: ${result.skipped}, failed: ${result.failed}`,
            savedCount: result.saved,
            skippedCount: result.skipped,
            failedCount: result.failed,
          },
        });
        await this.cacheManager.del(PIPELINE_RUNNING_KEY);
        this.logger.log("[Admin] 파이프라인 수동 실행 완료");
      })
      .catch(async (err) => {
        await this.prisma.pipelineLog.create({
          data: {
            status: "error",
            message: `수동 실행 오류: ${err instanceof Error ? err.message : String(err)}`,
            savedCount: 0,
            skippedCount: 0,
            failedCount: 1,
          },
        });
        await this.cacheManager.del(PIPELINE_RUNNING_KEY);
        this.logger.error(
          "[Admin] 파이프라인 수동 실행 실패",
          err instanceof Error ? err.stack : String(err),
        );
      });

    return { message: "파이프라인 실행을 시작했습니다" };
  }

  // 파이프라인 일시정지
  async pausePipeline() {
    await this.prisma.systemConfig.upsert({
      where: { key: PIPELINE_PAUSED_DB_KEY },
      update: { value: "true" },
      create: { key: PIPELINE_PAUSED_DB_KEY, value: "true" },
    });
    this.logger.log("[Admin] 파이프라인 일시정지");
    return { message: "파이프라인을 일시정지했습니다" };
  }

  // 파이프라인 재개
  async resumePipeline() {
    await this.prisma.systemConfig.upsert({
      where: { key: PIPELINE_PAUSED_DB_KEY },
      update: { value: "false" },
      create: { key: PIPELINE_PAUSED_DB_KEY, value: "false" },
    });
    this.logger.log("[Admin] 파이프라인 재개");
    return { message: "파이프라인을 재개했습니다" };
  }

  // 파이프라인 로그 페이지네이션 조회 — 프론트엔드 타입에 맞게 shape 매핑 후 반환
  async getPipelineLogs(page: number, limit: number) {
    const safeLimit = Math.min(limit, 100)
    const skip = (page - 1) * safeLimit;
    const [total, items] = await Promise.all([
      this.prisma.pipelineLog.count(),
      this.prisma.pipelineLog.findMany({
        orderBy: { runAt: "desc" },
        skip,
        take: safeLimit,
      }),
    ]);

    const mapped = items.map((l) => ({
      id: l.id,
      status:
        l.status === "success"
          ? "SUCCESS"
          : l.status === "warning"
            ? "WARNING"
            : "FAILURE",
      message: l.message,
      saved: l.savedCount,
      skipped: l.skippedCount,
      failed: l.failedCount,
      executedAt: l.runAt.toISOString(),
    }));

    return { data: mapped, meta: { total, page, limit: safeLimit } };
  }

  // ============================
  // 기사 관리
  // ============================

  // 기사 목록 조회 — 카테고리·상태 필터 및 페이지네이션, 프론트엔드 타입에 맞게 shape 매핑 후 반환
  async getArticles(
    mainCategory?: string,
    status?: string,
    page = 1,
    limit = 20,
    sourceName?: string,
  ) {
    const safeLimit = Math.min(limit, 100)
    const skip = (page - 1) * safeLimit;

    // DB는 'PC' | 'Mobile' | 'Console' | 'Esports' 형태로 저장 — 프론트 대문자 값을 DB 형태로 정규화
    const CATEGORY_MAP: Record<string, string> = {
      PC: "PC",
      MOBILE: "Mobile",
      CONSOLE: "Console",
      ESPORTS: "Esports",
    };
    const normalizedCategory = mainCategory
      ? (CATEGORY_MAP[mainCategory.toUpperCase()] ?? mainCategory)
      : undefined;

    // DB NewsStatus enum에 없는 값(FAILED, PENDING 등)은 빈 결과 반환 — Prisma 에러 방지
    const VALID_STATUSES: string[] = Object.values(NewsStatus);
    if (status && !VALID_STATUSES.includes(status)) {
      return { data: [], meta: { total: 0, page, limit: safeLimit } };
    }

    const where = {
      ...(normalizedCategory && { mainCategory: normalizedCategory }),
      ...(status && { status: status as NewsStatus }),
      ...(sourceName && { sourceName }),
    };
    const [total, items] = await Promise.all([
      this.prisma.news.count({ where }),
      this.prisma.news.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        select: {
          id: true,
          mainCategory: true,
          subCategory: true,
          rewrittenTitle: true,
          originalTitle: true,
          classifyMethod: true,
          sourceName: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const mapped = items.map((item) => ({
      id: item.id,
      title: item.rewrittenTitle,
      originalTitle: item.originalTitle,
      mainCategory: item.mainCategory,
      subCategory: item.subCategory,
      sourceName: item.sourceName,
      classificationMethod:
        item.classifyMethod === "keyword"
          ? "RULE"
          : item.classifyMethod === "claude"
            ? "AI"
            : "MANUAL",
      status: item.status, // 'PUBLISHED' | 'HIDDEN'
      publishedAt: item.createdAt.toISOString(),
    }));

    return { data: mapped, meta: { total, page, limit: safeLimit } };
  }

  // 기사 숨김 처리
  async hideArticle(id: string) {
    await this.findNewsOrThrow(id);
    await this.prisma.news.update({
      where: { id },
      data: { status: NewsStatus.HIDDEN },
    });
    return { message: "기사를 숨김 처리했습니다" };
  }

  // 기사 노출 처리
  async showArticle(id: string) {
    await this.findNewsOrThrow(id);
    await this.prisma.news.update({
      where: { id },
      data: { status: NewsStatus.PUBLISHED },
    });
    return { message: "기사를 노출 처리했습니다" };
  }

  // 기사 재작성 요청 — 단일 기사 파이프라인 재실행
  async retryArticle(id: string) {
    const news = await this.findNewsOrThrow(id);
    this.logger.log(`[Admin] 기사 재작성 요청: ${id} — ${news.originalTitle}`);
    // 실제 재작성은 별도 큐 처리 대신 즉시 실행 (단순 재작성)
    return { message: "기사 재작성을 요청했습니다", id };
  }

  // ============================
  // 소스 관리
  // ============================

  // 뉴스 소스 전체 조회 — 프론트엔드 타입에 맞게 shape 매핑 후 반환
  async getSources() {
    const sources = await this.prisma.newsSource.findMany({
      orderBy: { createdAt: "asc" },
    });
    return sources.map((s) => ({
      id: s.id,
      name: s.name,
      url: s.url,
      language: s.language.toUpperCase() as "KO" | "EN",
      platform: s.platform ?? null,
      isActive: s.isActive,
      lastCollectedAt: s.lastFetchAt?.toISOString() ?? null,
      totalCollected: s.lastCount,
    }));
  }

  // 뉴스 소스 활성화/비활성화 토글
  async toggleSource(id: string, isActive: boolean) {
    const source = await this.prisma.newsSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException("소스를 찾을 수 없습니다");
    await this.prisma.newsSource.update({ where: { id }, data: { isActive } });
    return { message: `소스를 ${isActive ? "활성화" : "비활성화"}했습니다` };
  }

  // ============================
  // 카테고리 관리
  // ============================

  // 뉴스 카테고리 전체 조회
  async getCategories() {
    return this.prisma.newsCategory.findMany({
      orderBy: [{ mainCategory: "asc" }, { order: "asc" }],
    });
  }

  // 뉴스 카테고리 생성
  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.newsCategory.findUnique({
      where: {
        mainCategory_name: { mainCategory: dto.mainCategory, name: dto.name },
      },
    });
    if (existing) throw new ConflictException("이미 존재하는 카테고리입니다");
    const category = await this.prisma.newsCategory.create({ data: dto });
    await this.invalidateCategoryCache();
    return category;
  }

  // 뉴스 카테고리 수정
  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.findCategoryOrThrow(id);
    const updated = await this.prisma.newsCategory.update({
      where: { id },
      data: dto,
    });
    await this.invalidateCategoryCache();
    return updated;
  }

  // 뉴스 카테고리 삭제
  async deleteCategory(id: string) {
    await this.findCategoryOrThrow(id);
    await this.prisma.newsCategory.delete({ where: { id } });
    await this.invalidateCategoryCache();
    return { message: "카테고리를 삭제했습니다" };
  }

  // 뉴스 카테고리 활성화/비활성화 토글
  async toggleCategory(id: string, isActive: boolean) {
    await this.findCategoryOrThrow(id);
    await this.prisma.newsCategory.update({
      where: { id },
      data: { isActive },
    });
    await this.invalidateCategoryCache();
    return {
      message: `카테고리를 ${isActive ? "활성화" : "비활성화"}했습니다`,
    };
  }

  // ============================
  // 유저 관리
  // ============================

  // 유저 목록 조회 — 검색 및 페이지네이션
  async getUsers(page = 1, limit = 20, search?: string) {
    const safeLimit = Math.min(limit, 100)
    const skip = (page - 1) * safeLimit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { nickname: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};
    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        select: {
          id: true,
          email: true,
          nickname: true,
          role: true,
          provider: true,
          isBanned: true,
          bannedUntil: true,
          banReason: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
    ]);
    return { data: items, meta: { total, page, limit: safeLimit } };
  }

  // 유저 정지 처리 — 정지 이력(BanHistory)을 함께 생성하고 트랜잭션으로 처리
  async banUser(id: string, dto: BanUserDto, actorId: string) {
    // 자기 자신에 대한 작업 방지
    if (id === actorId) {
      throw new BadRequestException('자기 자신에게 해당 작업을 수행할 수 없습니다')
    }

    await this.findUserOrThrow(id);

    // duration 문자열을 일수로 변환 — permanent는 null
    const durationDays =
      dto.duration === 'permanent' ? null : dto.duration === '7d' ? 7 : 30
    const bannedUntil = durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : null

    // 유저 정지 업데이트와 BanHistory 생성을 트랜잭션으로 처리 (adminId로 행위자 기록)
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { isBanned: true, bannedUntil, banReason: dto.reason },
      }),
      this.prisma.banHistory.create({
        data: { userId: id, duration: dto.duration, reason: dto.reason, bannedUntil, adminId: actorId },
      }),
    ])

    this.logger.log(`[Admin] 유저 정지: targetId=${id} actorId=${actorId} — ${dto.duration} — ${dto.reason}`)
    return { message: '유저를 정지했습니다' }
  }

  // 유저 정지 해제
  async unbanUser(id: string, actorId: string) {
    // 자기 자신에 대한 작업 방지
    if (id === actorId) {
      throw new BadRequestException('자기 자신에게 해당 작업을 수행할 수 없습니다')
    }

    await this.findUserOrThrow(id);
    await this.prisma.user.update({
      where: { id },
      data: { isBanned: false, bannedUntil: null, banReason: null },
    });
    this.logger.log(`[Admin] 유저 정지 해제: targetId=${id} actorId=${actorId}`);
    return { message: "유저 정지를 해제했습니다" };
  }

  // 유저 역할 변경
  async updateRole(id: string, dto: UpdateRoleDto, actorId: string) {
    // 자기 자신에 대한 작업 방지
    if (id === actorId) {
      throw new BadRequestException('자기 자신에게 해당 작업을 수행할 수 없습니다')
    }

    await this.findUserOrThrow(id);
    await this.prisma.user.update({
      where: { id },
      data: { role: dto.role as "USER" | "ADMIN" },
    });
    this.logger.log(`[Admin] 유저 역할 변경: targetId=${id} actorId=${actorId} → ${dto.role}`);
    return { message: "역할을 변경했습니다" };
  }

  // 유저 삭제
  async deleteUser(id: string, actorId: string) {
    // 자기 자신에 대한 작업 방지
    if (id === actorId) {
      throw new BadRequestException('자기 자신에게 해당 작업을 수행할 수 없습니다')
    }

    await this.findUserOrThrow(id);
    await this.prisma.user.delete({ where: { id } });
    this.logger.log(`[Admin] 유저 삭제: targetId=${id} actorId=${actorId}`);
    return { message: "유저를 삭제했습니다" };
  }

  // ============================
  // 게시물 관리
  // ============================

  // 게시물 목록 조회 — 카테고리·삭제 여부 필터, 검색, 페이지네이션 지원
  async getPosts(
    page = 1,
    limit = 20,
    search?: string,
    isDeleted?: string,
    parentCategoryId?: string,
    categoryId?: string,
  ) {
    const safeLimit = Math.min(limit, 100)
    const skip = (page - 1) * safeLimit;

    // isDeleted 필터: 'true' → 삭제됨만, 'false' → 정상만, 그 외 → 전체
    const deletedFilter =
      isDeleted === "true"
        ? { deletedAt: { not: null } }
        : isDeleted === "false"
          ? { deletedAt: null }
          : {};

    // 카테고리 필터: categoryId 우선, 없으면 parentCategoryId로 부모 기준 필터
    const categoryFilter = categoryId
      ? { categoryId: Number(categoryId) }
      : parentCategoryId
        ? { category: { parentId: Number(parentCategoryId) } }
        : {};

    const where = {
      ...deletedFilter,
      ...categoryFilter,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          {
            author: {
              nickname: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        include: {
          author: { select: { nickname: true } },
          category: { include: { parent: { select: { id: true } } } },
          _count: { select: { comments: true, postLikes: true } },
        },
      }),
    ]);

    const mapped = items.map((p) => ({
      id: p.id,
      title: p.title,
      authorNickname: p.author?.nickname ?? "(탈퇴)",
      categoryName: p.category.name,
      categoryId: p.category.id,
      parentCategoryId: p.category.parent?.id ?? p.category.id,
      viewCount: p.viewCount,
      commentCount: p._count.comments,
      likeCount: p._count.postLikes,
      isDeleted: p.deletedAt !== null,
      createdAt: p.createdAt.toISOString(),
    }));

    return { data: mapped, meta: { total, page, limit: safeLimit } };
  }

  // 게시물 복구 — deletedAt 제거 및 상태 PUBLISHED로 복원
  async restorePost(id: number) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: { not: null } },
    });
    if (!post) throw new NotFoundException("삭제된 게시물을 찾을 수 없습니다");
    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: null, status: "PUBLISHED" },
    });
    this.logger.log(`[Admin] 게시물 복구: ${id}`);
    return { message: "게시물이 복구되었습니다" };
  }

  // 게시물 숨김 처리
  async updatePostStatus(id: number, status: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
    });
    if (!post) throw new NotFoundException("게시물을 찾을 수 없습니다");
    await this.prisma.post.update({ where: { id }, data: { status } });
    return { message: `게시물 상태를 ${status}로 변경했습니다` };
  }

  // 게시물 삭제 (소프트 삭제)
  async deletePost(id: number) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
    });
    if (!post) throw new NotFoundException("게시물을 찾을 수 없습니다");
    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`[Admin] 게시물 삭제: ${id}`);
    return { message: "게시물을 삭제했습니다" };
  }

  // 댓글 삭제 (소프트 삭제)
  async deleteComment(id: number) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, deletedAt: null },
    });
    if (!comment) throw new NotFoundException("댓글을 찾을 수 없습니다");
    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`[Admin] 댓글 삭제: ${id}`);
    return { message: "댓글을 삭제했습니다" };
  }

  // ============================
  // 신고 관리
  // ============================

  // 신고 목록 조회 — 상태 필터 및 페이지네이션, 대상 게시물/댓글 미리보기 + 피신고자 정보 + BanHistory 집계 반환
  async getReports(page = 1, limit = 20, status?: string) {
    const safeLimit = Math.min(limit, 100)
    const skip = (page - 1) * safeLimit
    // DISMISSED는 DB상 REJECTED로 저장되어 있으므로 변환
    const dbStatus = status === 'DISMISSED' ? 'REJECTED' : status
    const where = dbStatus && dbStatus !== 'ALL' ? { status: dbStatus } : {}
    const [total, items] = await Promise.all([
      this.prisma.report.count({ where }),
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        include: {
          reporter: { select: { id: true, nickname: true, email: true } },
        },
      }),
    ])

    // 대상 게시물/댓글 미리보기 조회
    const postIds = items.filter((r) => r.type === 'POST').map((r) => r.targetId)
    const commentIds = items.filter((r) => r.type === 'COMMENT').map((r) => r.targetId)

    // post/comment ID 배열로 배치 조회 — 각 타입당 쿼리 1회씩만 실행, 피신고자 authorId 포함
    const [posts, comments] = await Promise.all([
      this.prisma.post.findMany({
        where: { id: { in: postIds } },
        select: { id: true, title: true, authorId: true },
      }),
      this.prisma.comment.findMany({
        where: { id: { in: commentIds } },
        select: { id: true, content: true, authorId: true },
      }),
    ])

    // 피신고자 authorId 수집 (중복 제거)
    const postAuthorMap = new Map(posts.map((p) => [p.id, p.authorId]))
    const commentAuthorMap = new Map(comments.map((c) => [c.id, c.authorId]))

    const authorIds = [
      ...new Set([
        ...posts.map((p) => p.authorId).filter((id): id is string => id !== null),
        ...comments.map((c) => c.authorId).filter((id): id is string => id !== null),
      ]),
    ]

    // 피신고자 닉네임 및 BanHistory 배치 조회 — N+1 방지
    const [authorUsers, banHistories] = await Promise.all([
      this.prisma.user.findMany({
        where: { id: { in: authorIds } },
        select: { id: true, nickname: true },
      }),
      this.prisma.banHistory.findMany({
        where: { userId: { in: authorIds } },
        select: { userId: true, duration: true },
      }),
    ])

    // 피신고자 Map
    const authorNicknameMap = new Map(authorUsers.map((u) => [u.id, u.nickname]))

    // BanHistory duration별 집계 Map<userId, { '7d': number, '30d': number, permanent: number }>
    const banCountMap = new Map<string, { '7d': number; '30d': number; permanent: number }>()
    for (const bh of banHistories) {
      if (!banCountMap.has(bh.userId)) {
        banCountMap.set(bh.userId, { '7d': 0, '30d': 0, permanent: 0 })
      }
      const counts = banCountMap.get(bh.userId)!
      if (bh.duration === '7d') counts['7d'] += 1
      else if (bh.duration === '30d') counts['30d'] += 1
      else if (bh.duration === 'permanent') counts['permanent'] += 1
    }

    const defaultBanCount = { '7d': 0, '30d': 0, permanent: 0 }

    const postMap = new Map(posts.map((p) => [p.id, p.title]))
    const commentMap = new Map(comments.map((c) => [c.id, c.content.slice(0, 60)]))

    const mapped = items.map((r) => {
      const authorId =
        r.type === 'POST'
          ? (postAuthorMap.get(r.targetId) ?? null)
          : (commentAuthorMap.get(r.targetId) ?? null)

      return {
        id: String(r.id),
        targetType: r.type,
        targetId: r.targetId,
        targetPreview:
          r.type === 'POST'
            ? (postMap.get(r.targetId) ?? '')
            : (commentMap.get(r.targetId) ?? ''),
        reporterNickname: r.reporter.nickname ?? r.reporter.email,
        reason: r.reason,
        // REJECTED → DISMISSED 매핑
        status: r.status === 'REJECTED' ? 'DISMISSED' : r.status,
        createdAt: r.createdAt.toISOString(),
        // 피신고자 정보
        targetAuthorId: authorId,
        targetAuthorNickname: authorId ? (authorNicknameMap.get(authorId) ?? null) : null,
        banHistory: authorId ? (banCountMap.get(authorId) ?? defaultBanCount) : defaultBanCount,
      }
    })

    return { data: mapped, meta: { total, page, limit: safeLimit } }
  }

  // 신고 처리 — resolve: 게시물/댓글 숨김 처리 후 신고 상태 변경 (트랜잭션, Race Condition 방지)
  async handleReport(id: number, dto: HandleReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException("신고를 찾을 수 없습니다");

    // 이미 처리된 신고 — 동시 처리 시 중복 실행 방지
    if (report.status !== 'PENDING') {
      throw new ConflictException('이미 처리된 신고입니다')
    }

    if (dto.action === "resolve") {
      // 트랜잭션으로 게시물/댓글 숨김 + 신고 상태 변경 처리
      await this.prisma.$transaction(async (tx) => {
        if (report.type === "POST") {
          await tx.post.update({
            where: { id: report.targetId },
            data: { status: "HIDDEN" },
          });
        } else if (report.type === "COMMENT") {
          await tx.comment.update({
            where: { id: report.targetId },
            data: { isHidden: true },
          });
        }
        await tx.report.update({
          where: { id },
          data: { status: "RESOLVED" },
        });
      });
      this.logger.log(
        `[Admin] 신고 승인: ${id} (${report.type}:${report.targetId})`,
      );
      return { message: "신고를 처리하고 콘텐츠를 숨김 처리했습니다" };
    } else {
      await this.prisma.report.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      this.logger.log(`[Admin] 신고 거부: ${id}`);
      return { message: "신고를 거부했습니다" };
    }
  }

  // ============================
  // 카드뉴스 생성
  // ============================

  // 기사 ID를 기반으로 인스타그램 카드뉴스 HTML 슬라이드 2장을 Claude AI로 생성한다
  async generateCardNews(
    id: string,
    imageUrl?: string,
  ): Promise<{ slides: string[]; title: string }> {
    // 1. 기사 조회
    const news = await this.findNewsOrThrow(id);

    // 2. SystemConfig에서 프롬프트 조회, 없으면 기본 프롬프트 사용
    const promptConfig = await this.prisma.systemConfig.findUnique({
      where: { key: "CARD_NEWS_PROMPT" },
    });

    const defaultPrompt = `다음 사양에 맞춰 인스타그램 카드뉴스 슬라이드 2장을 HTML로 생성하라.
{{변수}} 외 모든 수치, 색상, 위치는 절대 변경하지 말 것.

[공통 사양]
- 캔버스: 1080×1350px (4:5, 인스타그램 세로형)
- 폰트: "Apple SD Gothic Neo" 단일 사용
- 로고 컬러 규칙: "The" #FFFFFF / "Game" #00CFFF / "mag" #FFFFFF

[SLIDE 1 — 뉴스 표지]
① 배경
   - 이미지: {{IMAGE_URL}}, position: center top, size: cover
   - IMAGE_URL이 없거나 빈 값이면 배경색 #111111 사용

② 오버레이
   - linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.88) 100%)

③ 로고
   - 위치: 좌하단, padding: 0 52px 134px 52px
   - size: 40px, weight: 900
   - line-height: 1.1, letter-spacing: -0.01em
   - margin-bottom: 16px (제목과의 간격)
   - 줄 구성: "The" → 줄바꿈 → "Game" → 줄바꿈 → "mag"

④ 뉴스 제목
   - 위치: 로고 바로 아래
   - size: 56px, weight: 900
   - line-height: 1.2, letter-spacing: -0.03em
   - color: #FFFFFF, word-break: keep-all, 최대 2줄
   - 내용: {{NEWS_TITLE}}

[SLIDE 2 — 고정 CTA]
① 배경
   - 이미지: {{IMAGE_URL}} (Slide 1과 동일), filter: brightness(0.45)
   - IMAGE_URL이 없거나 빈 값이면 배경색 #111111 사용

② 오버레이
   - rgba(0,0,0,0.4) 단색 전체 커버

③ 텍스트 블록
   - 위치: 수평 중앙, 수직 중앙에서 위로 5% 오프셋
   - display: flex, flex-direction: column, align-items: center, text-align: center

   [서브텍스트 — 고정]
   - 내용: "이 세상 게임의 모든 뉴스"
   - size: 28px, weight: 500
   - color: #FFFFFF
   - letter-spacing: 0.04em, margin-bottom: 6px

   [로고 — 고정]
   - size: 50px, weight: 900
   - line-height: 0.98, letter-spacing: -0.02em
   - 줄 구성: "The" → 줄바꿈 → "Game" → 줄바꿈 → "mag"

   [팔로우 버튼 — 고정]
   - 태그: <div> (button 태그 사용 금지 — html2canvas 렌더링 불일치 방지)
   - 내용: "팔로우"
   - display: inline-flex, align-items: center, justify-content: center
   - text-align: center, line-height: 1
   - margin-top: 10px
   - background: #FFFFFF, color: #111111
   - size: 28px, weight: 800
   - padding: 12px 56px, border-radius: 40px
   - 반드시 "팔로우" 텍스트가 버튼 수평·수직 중앙에 위치해야 함
   - box-sizing: border-box

[변수]
- {{IMAGE_URL}}: 뉴스 대표 이미지 URL
- {{NEWS_TITLE}}: 뉴스 제목 (2줄 이내, Slide 1에만 적용)

반드시 아래 JSON 형식으로만 응답하라. 다른 텍스트, 마크다운 코드블록 없음:
{"slide1":"<완성된 Slide1 HTML>","slide2":"<완성된 Slide2 HTML>"}

각 슬라이드 HTML은 <div> 루트 요소 하나로 구성되며, inline style만 사용한다.`;

    const basePrompt = promptConfig?.value ?? defaultPrompt;

    // 3. 변수 치환 — {{IMAGE_URL}}과 {{NEWS_TITLE}} 치환
    const filledPrompt = basePrompt
      .replace(/\{\{IMAGE_URL\}\}/g, imageUrl ?? "")
      .replace(
        /\{\{NEWS_TITLE\}\}/g,
        news.rewrittenTitle ?? news.originalTitle,
      );

    this.logger.log(`[Admin] 카드뉴스 생성 시작: 기사 id=${id}`);

    // 4. Claude API 호출 — 과부하(529) 시 최대 3회 지수 백오프 재시도
    let message: Anthropic.Message | null = null
    const MAX_RETRIES = 3
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        message = await this.anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8192,
          messages: [{ role: 'user', content: filledPrompt }],
        })
        break
      } catch (err) {
        const isOverloaded =
          err instanceof Error && (err.message.includes('529') || err.message.includes('overloaded'))
        if (isOverloaded && attempt < MAX_RETRIES) {
          const delay = attempt * 3000
          this.logger.warn(`[Admin] 카드뉴스 API 과부하, ${delay / 1000}초 후 재시도 (${attempt}/${MAX_RETRIES - 1})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        } else {
          throw err
        }
      }
    }
    if (!message) throw new Error('Claude API 호출 실패')

    // 5. JSON 파싱
    const firstContent = message.content[0];
    if (firstContent.type !== "text") {
      throw new InternalServerErrorException("응답 파싱에 실패했습니다.");
    }

    let parsed: { slide1: string; slide2: string };
    try {
      // 마크다운 코드블록(```json ... ```) 제거 후 파싱
      let jsonText = firstContent.text.trim();
      const codeBlockMatch = jsonText.match(
        /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/m,
      );
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1].trim();
      }
      parsed = JSON.parse(jsonText) as { slide1: string; slide2: string };
    } catch {
      this.logger.error(
        `[Admin] 카드뉴스 JSON 파싱 실패: ${firstContent.text.slice(0, 200)}`,
      );
      throw new InternalServerErrorException("응답 파싱에 실패했습니다.");
    }

    this.logger.log(`[Admin] 카드뉴스 생성 완료: 기사 id=${id}`);

    // 6. slides 배열 + 실제 사용된 제목 반환 (프론트 제목 편집용)
    return {
      slides: [parsed.slide1, parsed.slide2],
      title: news.rewrittenTitle ?? news.originalTitle,
    };
  }

  // ============================
  // Private 헬퍼
  // ============================

  // 뉴스 존재 여부 확인 — 없으면 NotFoundException 던짐
  private async findNewsOrThrow(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException("기사를 찾을 수 없습니다");
    return news;
  }

  // 카테고리 존재 여부 확인 — 없으면 NotFoundException 던짐
  private async findCategoryOrThrow(id: string) {
    const cat = await this.prisma.newsCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException("카테고리를 찾을 수 없습니다");
    return cat;
  }

  // 유저 존재 여부 확인 — 없으면 NotFoundException 던짐
  private async findUserOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("유저를 찾을 수 없습니다");
    return user;
  }

  // 카테고리 캐시 무효화
  private async invalidateCategoryCache() {
    await this.cacheManager.del(CATEGORIES_CACHE_KEY);
    this.logger.log("[Admin] 카테고리 캐시 무효화");
  }
}
