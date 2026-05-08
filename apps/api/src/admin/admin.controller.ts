// apps/api/src/admin/admin.controller.ts
// 어드민 대시보드 컨트롤러 — 모든 엔드포인트에 AdminGuard와 응답 래퍼를 적용한다

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  DefaultValuePipe,
  Injectable,
} from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import { AdminService } from './admin.service'
import { AdminGuard } from './guards/admin.guard'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto'
import { BanUserDto, UpdateRoleDto } from './dto/user-action.dto'
import { HandleReportDto } from './dto/report-action.dto'

// 어드민 응답을 { success: true, data } 포맷으로 통일하는 인터셉터
@Injectable()
class AdminResponseInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => ({ success: true, data })))
  }
}

@Controller('admin')
@UseGuards(AdminGuard)
@UseInterceptors(AdminResponseInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============================
  // 통계
  // ============================

  // 오늘의 수집 통계 및 전체 현황 조회
  @Get('stats')
  async getStats() {
    return this.adminService.getStats()
  }

  // 일별 수집 히스토리 조회
  @Get('stats/history')
  async getStatsHistory(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.adminService.getStatsHistory(days)
  }

  // 카테고리별 기사 수 조회
  @Get('stats/categories')
  async getStatsCategories() {
    return this.adminService.getStatsCategories()
  }

  // 월별 비용 히스토리 조회
  @Get('stats/cost')
  async getCostHistory(
    @Query('months', new DefaultValuePipe(3), ParseIntPipe) months: number,
  ) {
    return this.adminService.getCostHistory(months)
  }

  // ============================
  // 파이프라인
  // ============================

  // 파이프라인 현재 상태 조회
  @Get('pipeline/status')
  async getPipelineStatus() {
    return this.adminService.getPipelineStatus()
  }

  // 파이프라인 수동 실행
  @Post('pipeline/run')
  async runPipeline() {
    return this.adminService.runPipeline()
  }

  // 파이프라인 일시정지
  @Post('pipeline/pause')
  async pausePipeline() {
    return this.adminService.pausePipeline()
  }

  // 파이프라인 재개
  @Post('pipeline/resume')
  async resumePipeline() {
    return this.adminService.resumePipeline()
  }

  // 파이프라인 로그 조회
  @Get('pipeline/logs')
  async getPipelineLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getPipelineLogs(page, limit)
  }

  // ============================
  // 기사 관리
  // ============================

  // 기사 목록 조회
  @Get('articles')
  async getArticles(
    @Query('mainCategory') mainCategory?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('sourceName') sourceName?: string,
  ) {
    return this.adminService.getArticles(mainCategory, status, page, limit, sourceName)
  }

  // 기사 숨김 처리
  @Put('articles/:id/hide')
  async hideArticle(@Param('id') id: string) {
    return this.adminService.hideArticle(id)
  }

  // 기사 노출 처리
  @Put('articles/:id/show')
  async showArticle(@Param('id') id: string) {
    return this.adminService.showArticle(id)
  }

  // 기사 재작성 요청
  @Post('articles/:id/retry')
  async retryArticle(@Param('id') id: string) {
    return this.adminService.retryArticle(id)
  }

  // ============================
  // 소스 관리
  // ============================

  // 뉴스 소스 목록 조회
  @Get('sources')
  async getSources() {
    return this.adminService.getSources()
  }

  // 뉴스 소스 활성화/비활성화 토글
  @Put('sources/:id/toggle')
  async toggleSource(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.toggleSource(id, isActive)
  }

  // ============================
  // 카테고리 관리
  // ============================

  // 카테고리 목록 조회
  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories()
  }

  // 카테고리 생성
  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto)
  }

  // 카테고리 수정
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.adminService.updateCategory(id, dto)
  }

  // 카테고리 삭제
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id)
  }

  // 카테고리 활성화/비활성화 토글
  @Put('categories/:id/toggle')
  async toggleCategory(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.toggleCategory(id, isActive)
  }

  // ============================
  // 유저 관리
  // ============================

  // 유저 목록 조회
  @Get('users')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page, limit, search)
  }

  // 유저 정지
  @Patch('users/:id/ban')
  async banUser(@Param('id') id: string, @Body() dto: BanUserDto) {
    return this.adminService.banUser(id, dto)
  }

  // 유저 정지 해제
  @Patch('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id)
  }

  // 유저 역할 변경
  @Patch('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateRole(id, dto)
  }

  // 유저 삭제
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id)
  }

  // ============================
  // 게시물 관리
  // ============================

  // 게시물 목록 조회
  @Get('posts')
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isDeleted') isDeleted?: string,
    @Query('parentCategoryId') parentCategoryId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.adminService.getPosts(page, limit, search, isDeleted, parentCategoryId, categoryId)
  }

  // 게시물 숨김 처리
  @Put('posts/:id/hide')
  async hidePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.updatePostStatus(id, 'HIDDEN')
  }

  // 게시물 노출 처리
  @Put('posts/:id/show')
  async showPost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.updatePostStatus(id, 'PUBLISHED')
  }

  // 게시물 복구
  @Put('posts/:id/restore')
  async restorePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.restorePost(id)
  }

  // 게시물 삭제
  @Delete('posts/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePost(id)
  }

  // 댓글 삭제
  @Delete('comments/:id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteComment(id)
  }

  // ============================
  // 신고 관리
  // ============================

  // 신고 목록 조회
  @Get('reports')
  async getReports(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getReports(page, limit, status)
  }

  // 신고 처리
  @Patch('reports/:id')
  async handleReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: HandleReportDto,
  ) {
    return this.adminService.handleReport(id, dto)
  }
}
