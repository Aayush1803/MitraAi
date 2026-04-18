// Phase 1 — @nextjs-best-practices skill
// Dedicated loading.tsx per route provides Suspense boundary automatically.
// Next.js shows this while the page shell hydrates, eliminating layout shifts.

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      {/* Brand pulse loader */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4F8EFF] to-[#7C3AED] blur-xl opacity-40 animate-pulse" />
      </div>

      {/* Skeleton title */}
      <div className="space-y-3 text-center">
        <div className="h-4 w-48 rounded-full bg-[#1E1E2E] animate-pulse mx-auto" />
        <div className="h-3 w-32 rounded-full bg-[#1E1E2E] animate-pulse mx-auto" />
      </div>

      {/* Skeleton card */}
      <div className="w-full max-w-3xl px-4">
        <div className="rounded-2xl border border-[#1E1E2E] bg-[#111118] p-6 space-y-4">
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 flex-1 rounded-xl bg-[#1E1E2E] animate-pulse" />
            ))}
          </div>
          <div className="h-40 rounded-xl bg-[#1E1E2E] animate-pulse" />
          <div className="h-14 rounded-xl bg-[#1E1E2E] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
