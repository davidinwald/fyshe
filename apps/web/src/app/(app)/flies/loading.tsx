export default function FliesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded bg-muted" />
          <div className="h-10 w-28 rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
