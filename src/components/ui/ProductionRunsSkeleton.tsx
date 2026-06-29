export function ProductionRunsSkeleton() {
    return (
        <div className="w-full animate-pulse mt-8">
            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 px-6 py-6 border-b border-surface-active bg-zinc-900">
                {["", "", "", "", "", "", ""].map((col) => (
                    <div
                        key={col}
                        className="h-3 bg-text-label rounded w-3/4"
                    />
                ))}
            </div>

            {/* Skeleton rows */}
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-7 gap-4 px-4 py-4 border-b border-surface-active bg-zinc-950"
                    style={{ opacity: 1 - i * 0.08 }}
                >
                    <div className="h-3 bg-zinc-800 rounded w-1/5" />
                    <div className="h-3 bg-zinc-800 rounded w-2/3" />
                    <div className="h-3 bg-zinc-800 rounded w-5/6" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                </div>
            ))}
        </div>
    );
}
