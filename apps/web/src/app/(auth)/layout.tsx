export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-block text-xl font-bold text-text-primary">
            Game Magazine
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
