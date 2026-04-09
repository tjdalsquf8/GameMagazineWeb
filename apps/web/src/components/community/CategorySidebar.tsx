'use client'

import Link from 'next/link'
import { mockCategories } from '@/lib/mock/community'

interface CategorySidebarProps {
  currentSlug?: string
  onClose?: () => void
}

export default function CategorySidebar({ currentSlug = 'all', onClose }: CategorySidebarProps) {
  const parents = mockCategories.filter((c) => c.parentId === null)
  const getChildren = (parentId: number) => mockCategories.filter((c) => c.parentId === parentId)

  return (
    <aside className="w-[200px] shrink-0">
      <div className="border border-border rounded-md overflow-hidden">
        <div className="px-3 py-2 bg-surface border-b border-border">
          <span className="text-sm font-semibold text-text-primary">카테고리</span>
        </div>
        <nav className="py-1">
          {parents.map((parent) => {
            const children = getChildren(parent.id)
            const isParentActive = currentSlug === parent.slug

            return (
              <div key={parent.id}>
                <Link
                  href={`/community?category=${parent.slug}`}
                  onClick={onClose}
                  className={[
                    'flex items-center px-3 py-2 text-sm transition-colors duration-150',
                    isParentActive
                      ? 'font-bold text-text-primary bg-surface-hover'
                      : 'text-text-secondary hover:bg-surface',
                  ].join(' ')}
                >
                  {parent.name}
                </Link>
                {children.map((child) => {
                  const isChildActive = currentSlug === child.slug
                  return (
                    <Link
                      key={child.id}
                      href={`/community?category=${child.slug}`}
                      onClick={onClose}
                      className={[
                        'flex items-center pl-6 pr-3 py-2 text-sm transition-colors duration-150',
                        isChildActive
                          ? 'font-bold text-text-primary bg-surface-hover'
                          : 'text-text-muted hover:bg-surface hover:text-text-secondary',
                      ].join(' ')}
                    >
                      {child.name}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
