export function ChartSkeleton({ type = "line" }: { type?: "line" | "pie" }) {
    return (
        <div className="flex h-full w-full flex-1 animate-pulse flex-col p-5">
            {type === "line" ? (
                <div className="flex-1 rounded-lg bg-gray-100"></div>
            ) : (
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-40 w-40 rounded-full bg-gray-100"></div>
                </div>
            )}
        </div>
    );
}
