"use client";

import { useState } from "react";
import { ActivityItem } from "./types";
import { ActivityList } from "./ActivityList";
import { ActivityDetail } from "./ActivityDetail";
import { ResizerHandle } from "./ResizerHandle";

import { fetchMoreTransactions } from "../actions";

export function ActivityLayout({ data }: { data: ActivityItem[] }) {
    // state to store the data in
    const [tableData, setTableData] = useState<ActivityItem[]>(data);
    // save the current offset for pagination
    const [offset, setOffset] = useState(200);
    // loading state for the "Load More" button
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(data.length >= 200);

    const [isFiltering, setIsFiltering] = useState(false);
    // Stores the officially applied dates so pagination knows what to fetch
    const [activeDates, setActiveDates] = useState<{
        start?: string;
        end?: string;
    }>({});

    const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
    const [leftPanelWidthPct, setLeftPanelWidthPct] = useState(40);
    const [isDragging, setIsDragging] = useState(false);

    async function handleLoadMore() {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            const newItems = await fetchMoreTransactions(
                offset,
                activeDates.start,
                activeDates.end,
            );
            setTableData((prev) => [...prev, ...newItems]);
            setOffset((prev) => prev + 200);

            if (newItems.length < 200) setHasMore(false);
        } catch (error) {
            console.error("Failed to load more transactions:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handleApplyFilter(start?: string, end?: string) {
        setIsFiltering(true);
        setActiveDates({ start, end });
        setTableData([]); // Clear table so user sees the loading state
        try {
            // Ask server for offset 0 of the new date range
            const newItems = await fetchMoreTransactions(0, start, end);
            setTableData(newItems);
            setOffset(newItems.length);
            setHasMore(newItems.length >= 200);
        } catch (error) {
            console.error("Failed to filter transactions:", error);
        } finally {
            setIsFiltering(false);
        }
    }

    function handleClearFilter() {
        setActiveDates({});
        setTableData(data); // Restore initial 200 records instantly
        setOffset(data.length);
        setHasMore(data.length >= 200);
    }

    function handleActivityOnClick(item: ActivityItem) {
        setSelectedItem((prev) => (prev?.id === item.id ? null : item));
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        const startX = e.clientX;
        const startWidthPct = leftPanelWidthPct;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPct = (deltaX / window.innerWidth) * 100;
            const newWidthPct = startWidthPct + deltaPct;
            setLeftPanelWidthPct(Math.max(25, Math.min(newWidthPct, 75)));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "col-resize";
    };

    return (
        <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden">
            <style>{`
                @keyframes slideInFromRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* LEFT PANEL */}
            <div
                className={`flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm ${
                    !selectedItem ? "w-full" : ""
                } ${
                    !isDragging
                        ? "transition-[width] duration-300 ease-in-out"
                        : ""
                }`}
                style={
                    selectedItem
                        ? { width: `${leftPanelWidthPct}%`, flexShrink: 0 }
                        : undefined
                }
            >
                <ActivityList
                    data={tableData}
                    selectedItem={selectedItem}
                    onItemClick={handleActivityOnClick}
                    onLoadMoreButtonClick={handleLoadMore}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    isFiltering={isFiltering}
                    onApplyFilter={handleApplyFilter}
                    onClearFilter={handleClearFilter}
                />
            </div>

            {/* DRAGGABLE RESIZER & RIGHT PANEL */}
            {selectedItem && (
                <>
                    <ResizerHandle onMouseDown={handleMouseDown} />
                    <ActivityDetail 
                        item={selectedItem} 
                        onClose={() => setSelectedItem(null)} 
                    />
                </>
            )}
        </div>
    );
}
