'use client'

// PostList.tsx
// 커뮤니티 게시글 목록 컴포넌트
// 카테고리 필터, 정렬, 검색(제목), 페이지네이션 기능 포함
// 검색어는 URL 쿼리 파라미터 ?search=키워드 로 관리

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getPosts } from '@/lib/api/posts'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'
import PostListItem from '@/components/community/PostListItem'
import PostListSkeleton from '@/components/community/PostListSkeleton'
import Pagination from '@/components/community/Pagination'
import SearchBar from '@/components/community/SearchBar'
import type { Post } from '@/types/community'

const PAGE_SIZE = 10
type SortOption = 'latest' | 'popular' | 'comments'

export default function PostList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category') ?? 'all'

  // URL에서 검색어 초기값 읽기
  const initialSearch = searchParams.get('search') ?? ''

  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<SortOption>('latest')
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(initialSearch)

  // --- Breadcrumb 및 카테고리 정보 로직 ---

  /** 현재 카테고리 slug로 이름, ID, 부모 카테고리 반환 */
  const findCategoryInfo = () => {
    if (categorySlug === 'all') return { name: '전체', id: undefined, parent: null }

    // 먼저 대분류에서 찾기
    const parent = COMMUNITY_CATEGORIES.find((c) => c.slug === categorySlug)
    if (parent) return { name: parent.name, id: parent.id, parent: null }

    // 소분류에서 찾기
    for (const p of COMMUNITY_CATEGORIES) {
      const child = p.children?.find((c) => c.slug === categorySlug)
      if (child) return { name: child.name, id: child.id, parent: p }
    }

    return { name: '전체', id: undefined, parent: null }
  }

  const { name: categoryName, id: categoryId, parent: parentCategory } = findCategoryInfo()
  // --------------------------------------

  /** 게시글 목록 fetch — 카테고리/정렬/페이지/검색어 변경 시 재호출 */
  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getPosts({
        page: currentPage,
        limit: PAGE_SIZE,
        categoryId,
        sort,
        search: search || undefined,
      })
      setPosts(res.items ?? [])
      setTotal(res.total ?? 0)
      setTotalPages(res.totalPages ?? 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, categoryId, sort, search])

  // 카테고리·정렬 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [categorySlug, sort])

  // 검색어 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  /** 글쓰기 버튼 — 카테고리 컨텍스트 유지하며 이동 */
  const handleWrite = () => {
    const queryString = categorySlug !== 'all' ? `?category=${categorySlug}` : ''
    router.push(`/community/write${queryString}`)
  }

  /** 검색 실행 — URL 쿼리 파라미터 업데이트 및 목록 재조회 */
  const handleSearch = (keyword: string) => {
    setSearch(keyword)

    // URL 쿼리 파라미터 동기화
    const params = new URLSearchParams(searchParams.toString())
    if (keyword) {
      params.set('search', keyword)
    } else {
      params.delete('search')
    }
    router.replace(`/community?${params.toString()}`, { scroll: false })
  }

  const isSearching = (search?.length ?? 0) > 0

  return (
    <div className="flex-1 min-w-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-text-muted mb-3 overflow-x-auto whitespace-nowrap">
        <Link href="/community" className="hover:text-text-secondary transition-colors">
          커뮤니티
        </Link>

        {categorySlug !== 'all' && (
          <>
            <span className="text-[var(--color-text-muted)]">/</span>
            {parentCategory ? (
              <>
                <Link
                  href={`/community?category=${parentCategory.slug}`}
                  className="hover:text-text-secondary transition-colors"
                >
                  {parentCategory.name}
                </Link>
                <span className="text-[var(--color-text-muted)]">/</span>
              </>
            ) : null}
            <span className="font-medium text-text-secondary">{categoryName}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-primary">{categoryName}</h2>
          {!isLoading && (
            <span className="text-sm text-text-muted">
              {isSearching ? `${total}개의 검색 결과` : `총 ${total}개`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* 검색바 */}
          <SearchBar onSearch={handleSearch} defaultValue={initialSearch} isLoading={isLoading} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm border border-border rounded px-2 py-1.5 bg-background text-text-secondary focus:outline-none focus:border-primary transition-colors"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="comments">댓글순</option>
          </select>
          <button
            type="button"
            onClick={handleWrite}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors duration-150"
          >
            글쓰기
          </button>
        </div>
      </div>

      <div className="border border-[var(--color-border)] rounded-md overflow-hidden bg-[var(--color-background)]">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="py-2 px-3 text-xs font-medium text-text-muted text-center w-12">
                번호
              </th>
              <th className="py-2 px-2 text-xs font-medium text-text-muted text-left w-24">
                카테고리
              </th>
              <th className="py-2 px-2 text-xs font-medium text-text-muted text-left">제목</th>
              <th className="py-2 px-2 text-xs font-medium text-text-muted text-center w-24 hidden md:table-cell">
                작성자
              </th>
              <th className="py-2 px-2 text-xs font-medium text-text-muted text-center w-20 hidden sm:table-cell">
                날짜
              </th>
              <th className="py-2 px-3 text-xs font-medium text-text-muted text-center w-16 hidden sm:table-cell">
                조회수
              </th>
              <th className="py-2 px-3 text-xs font-medium text-text-muted text-center w-16 hidden sm:table-cell">
                추천수
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <PostListSkeleton />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-text-muted">
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-base">검색 결과가 없습니다</span>
                      <span className="text-xs text-text-muted">
                        &apos;{search}&apos; 에 대한 결과를 찾을 수 없습니다
                      </span>
                    </div>
                  ) : (
                    '게시글이 없습니다'
                  )}
                </td>
              </tr>
            ) : (
              posts.map((post, i) => (
                <PostListItem key={post.id} post={post} index={(currentPage - 1) * PAGE_SIZE + i} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
