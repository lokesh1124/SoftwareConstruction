export function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/5 rounded-2xl animate-pulse ${className}`} />
  );
}

export function SkeletonCard({ height = 'h-40' }: { height?: string }) {
  return (
    <div className={`bg-[var(--color-surface-container)] rounded-[2rem] p-6 border border-white/5 ${height} animate-pulse`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 bg-white/5 rounded-full" />
          <div className="h-2 w-1/2 bg-white/3 rounded-full" />
        </div>
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-2 w-full bg-white/5 rounded-full" />
        <div className="h-2 w-4/5 bg-white/5 rounded-full" />
        <div className="h-2 w-3/5 bg-white/3 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 pt-8 space-y-10 animate-in fade-in duration-300">
      {/* Greeting skeleton */}
      <div className="space-y-3">
        <div className="h-3 w-32 bg-white/5 rounded-full animate-pulse" />
        <div className="h-10 w-72 bg-white/5 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Ring skeleton */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 flex flex-col items-center border border-white/5 animate-pulse">
            <div className="w-64 h-64 rounded-full bg-white/3" />
            <div className="grid grid-cols-3 gap-4 w-full mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-5 w-12 bg-white/5 rounded" />
                  <div className="h-2 w-8 bg-white/3 rounded" />
                </div>
              ))}
            </div>
          </div>
          <SkeletonCard height="h-32" />
          <SkeletonCard height="h-32" />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <SkeletonCard height="h-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard height="h-44" />
            <SkeletonCard height="h-44" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} height="h-28" />)}
          </div>
        </div>
      </div>
    </main>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-[var(--color-surface-container)] rounded-2xl border border-white/5 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-white/5 rounded-full" />
            <div className="h-2 w-2/3 bg-white/3 rounded-full" />
          </div>
          <div className="h-3 w-12 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
}
