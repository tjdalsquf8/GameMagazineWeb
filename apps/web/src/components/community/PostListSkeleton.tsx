export default function PostListSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 px-3">
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-5 bg-gray-200 rounded" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded hidden md:block" />
          <div className="w-14 h-4 bg-gray-200 rounded hidden sm:block" />
          <div className="w-10 h-4 bg-gray-200 rounded hidden sm:block" />
        </div>
      ))}
    </div>
  )
}
