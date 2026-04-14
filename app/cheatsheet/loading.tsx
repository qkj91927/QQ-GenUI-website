export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0c1016] text-[#edf1f8]">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded-xl bg-white/10" />
        <div className="h-16 w-full animate-pulse rounded-2xl bg-white/8" />
        <div className="space-y-3">
          <div className="h-44 w-full animate-pulse rounded-2xl bg-white/8" />
          <div className="h-44 w-full animate-pulse rounded-2xl bg-white/8" />
        </div>
      </div>
    </div>
  );
}
