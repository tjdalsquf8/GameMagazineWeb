'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockPosts } from '@/lib/mock/community'
import PostListItem from '@/components/community/PostListItem'
import Pagination from '@/components/community/Pagination'

const PAGE_SIZE = 10

export default function PostList() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(mockPosts.length / PAGE_SIZE)
  const pagedPosts = mockPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-text-primary">전체</h2>
          <span className="text-sm text-text-muted">총 {mockPosts.length}개</span>
        </div>
        <Link
          href="/community/write"
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors duration-150"
        >
          글쓰기
        </Link>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
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
            </tr>
          </thead>
          <tbody>
            {pagedPosts.map((post, i) => (
              <PostListItem key={post.id} post={post} index={(currentPage - 1) * PAGE_SIZE + i} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}
