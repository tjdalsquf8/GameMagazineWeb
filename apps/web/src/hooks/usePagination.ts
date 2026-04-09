'use client'

import { useState } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  getOffset: () => number
}

export function usePagination({
  initialPage = 1,
  pageSize = 20,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage)

  return {
    page,
    pageSize,
    setPage,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    getOffset: () => (page - 1) * pageSize,
  }
}
