// 어드민 커뮤니티 게시글 관리 페이지
// 부모 카테고리 탭 + 서브카테고리 드롭다운 + 삭제 상태 필터 + 키워드 검색 + 페이지네이션
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToastStore } from '@/store/toastStore'
import { fetchAdminPosts, deleteAdminPost, restoreAdminPost } from '@/lib/api/admin.api'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'
import type { AdminPost, PostFilter } from '@/types/admin.types'
import { Trash2, RotateCcw, Search, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── 상수 ────────────────────────────────────────────────────────

/** 페이지당 게시글 수 */
const PAGE_LIMIT = 20

/** 삭제 상태 필터 옵션 */
const DELETED_FILTER_OPTIONS: { key: PostFilter['isDeleted']; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: false, label: '정상' },
  { key: true, label: '삭제됨' },
]

/** 게시글 관리 페이지 컴포넌트 */
export default function AdminCommunityPostsPage() {
  const { showToast } = useToastStore()
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [parentCategoryId, setParentCategoryId] = useState<number | 'ALL'>('ALL')
  const [categoryId, setCategoryId] = useState<number | 'ALL'>('ALL')
  const [deletedFilter, setDeletedFilter] = useState<PostFilter['isDeleted']>('ALL')
  const [keyword, setKeyword] = useState('')
  const [inputKeyword, setInputKeyword] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  /** 전체 페이지 수 */
  const totalPages = Math.ceil(total / PAGE_LIMIT)

  /** 선택된 부모 카테고리의 서브카테고리 목록 */
  const subCategories =
    parentCategoryId === 'ALL'
      ? []
      : (COMMUNITY_CATEGORIES.find((c) => c.id === parentCategoryId)?.children ?? [])

  /** 부모 카테고리 변경 시 서브카테고리 초기화, page=1 */
  function handleParentCategoryChange(id: number | 'ALL') {
    setParentCategoryId(id)
    setCategoryId('ALL')
    setPage(1)
  }

  /** 삭제 필터 변경 시 page=1 */
  function handleDeletedFilterChange(key: PostFilter['isDeleted']) {
    setDeletedFilter(key)
    setPage(1)
  }

  /** 게시글 목록 불러오기 */
  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchAdminPosts({
      parentCategoryId,
      categoryId,
      isDeleted: deletedFilter,
      keyword,
      page,
      limit: PAGE_LIMIT,
    })
    if (res.success) {
      setPosts(res.data.posts)
      setTotal(res.data.total)
    }
    setIsLoading(false)
  }, [parentCategoryId, categoryId, deletedFilter, keyword, page])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  /** 검색 실행 — page=1로 초기화 */
  function handleSearch() {
    setPage(1)
    setKeyword(inputKeyword)
  }

  /** 엔터 키 검색 */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch()
  }

  /** 페이지 변경 */
  function handlePageChange(next: number) {
    if (next < 1 || next > totalPages) return
    setPage(next)
  }

  /** 게시글 삭제 */
  async function handleDelete(id: number) {
    setActionLoading(id)
    const res = await deleteAdminPost(id)
    if (res.success) {
      showToast(res.data.message, 'success')
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isDeleted: true } : p)))
    } else {
      showToast('삭제에 실패했습니다.', 'error')
    }
    setActionLoading(null)
  }

  /** 게시글 복구 */
  async function handleRestore(id: number) {
    setActionLoading(id)
    const res = await restoreAdminPost(id)
    if (res.success) {
      showToast(res.data.message, 'success')
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isDeleted: false } : p)))
    } else {
      showToast('복구에 실패했습니다.', 'error')
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">게시글 관리</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          커뮤니티 게시글을 조회하고 관리합니다.
        </p>
      </div>

      {/* 부모 카테고리 탭 */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handleParentCategoryChange('ALL')}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            parentCategoryId === 'ALL'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]',
          ].join(' ')}
        >
          전체
        </button>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleParentCategoryChange(cat.id)}
            className={[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              parentCategoryId === cat.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]',
            ].join(' ')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 서브카테고리 드롭다운 (부모 선택 시만 표시) */}
      {subCategories.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">세부</span>
          <select
            value={categoryId === 'ALL' ? '' : String(categoryId)}
            onChange={(e) => {
              setCategoryId(e.target.value === '' ? 'ALL' : Number(e.target.value))
              setPage(1)
            }}
            className="text-sm border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white dark:bg-gray-900 text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">전체</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={String(sub.id)}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 삭제 상태 필터 + 검색 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden text-sm">
          {DELETED_FILTER_OPTIONS.map((opt) => (
            <button
              key={String(opt.key)}
              type="button"
              onClick={() => handleDeletedFilterChange(opt.key)}
              className={[
                'px-3 py-1.5 transition-colors',
                deletedFilter === opt.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white dark:bg-gray-900 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              placeholder="제목 또는 작성자 검색"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-[var(--color-border)] rounded-md bg-white dark:bg-gray-900 text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            검색
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
            게시글이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">
                    제목
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-24">
                    작성자
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)] w-28">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-text-muted)] w-16">
                    조회
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-text-muted)] w-16">
                    댓글
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-text-muted)] w-16">
                    상태
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-text-muted)] w-20">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => window.open(`/community/${post.id}`, '_blank')}
                    className={[
                      'hover:bg-[var(--color-surface)] transition-colors cursor-pointer',
                      post.isDeleted ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{post.id}</td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)] max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {post.authorNickname}
                    </td>
                    <td className="px-4 py-3 max-w-[120px]">
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                        {post.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-text-muted)]">
                      {post.viewCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-text-muted)]">
                      {post.commentCount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {post.isDeleted ? (
                        <span className="text-xs font-medium text-red-500 dark:text-red-400">
                          삭제됨
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          정상
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-1">
                        {post.isDeleted ? (
                          <button
                            type="button"
                            onClick={() => handleRestore(post.id)}
                            disabled={actionLoading === post.id}
                            title="복구"
                            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            disabled={actionLoading === post.id}
                            title="삭제"
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-[var(--color-text-muted)]">
            {(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)} / 총{' '}
            {total.toLocaleString()}건
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p =
                totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= totalPages - 3
                      ? totalPages - 6 + i
                      : page - 3 + i
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={[
                    'min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors border',
                    page === p
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                  ].join(' ')}
                >
                  {p}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
