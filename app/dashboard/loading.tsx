export default function DashboardLoading() {
    return (
        <main className="ml-64 flex h-full flex-1 flex-col p-6">
            {/* Header Skeleton */}
            <div className="mb-6 shrink-0 animate-pulse">
                <div className="h-8 w-48 rounded bg-gray-200"></div>
                <div className="mt-2 h-4 w-32 rounded bg-gray-200"></div>
            </div>

            {/* 1. Key Metrics Skeleton (Top Row) */}
            <div className="mb-6 grid shrink-0 grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <div className="h-3 w-24 rounded bg-gray-200"></div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <div className="h-8 w-32 rounded bg-gray-200"></div>
                            <div className="h-6 w-16 rounded-full bg-gray-100"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Main Content Grid Skeleton */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT COLUMN: Recent Activity Skeleton */}
                <div className="flex min-h-0 animate-pulse flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="shrink-0 border-b border-gray-100 p-5">
                        <div className="h-5 w-32 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex-1 space-y-6 p-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                                    <div>
                                        <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                                        <div className="h-3 w-32 rounded bg-gray-100"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="mb-2 h-4 w-16 rounded bg-gray-200"></div>
                                    <div className="h-3 w-12 rounded bg-gray-100"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Split Top/Bottom Charts Skeleton */}
                <div className="flex min-h-0 flex-col gap-6">
                    {/* Top Chart Skeleton */}
                    <div className="flex min-h-0 flex-1 animate-pulse flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 h-5 w-48 rounded bg-gray-200"></div>
                        <div className="flex-1 rounded-lg bg-gray-100"></div>
                    </div>

                    {/* Bottom Chart Skeleton */}
                    <div className="flex min-h-0 flex-1 animate-pulse flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 h-5 w-40 rounded bg-gray-200"></div>
                        <div className="flex flex-1 items-center justify-center">
                            <div className="h-40 w-40 rounded-full bg-gray-100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
