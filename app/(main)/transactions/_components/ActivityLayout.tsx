"use client";

import { useState } from "react";
import { ActivityItem } from "./types";
import { ActivityList } from "./ActivityList";
import { ActivityDetail } from "./ActivityDetail";
import { ResizerHandle } from "./ResizerHandle";

export function ActivityLayout({ data }: { data: ActivityItem[] }) {
    const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
    const [leftPanelWidthPct, setLeftPanelWidthPct] = useState(40);
    const [isDragging, setIsDragging] = useState(false);

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
                <div className="shrink-0 border-b border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-900">
                        Recent Activity
                    </h2>
                </div>

                <ActivityList
                    data={data}
                    selectedItem={selectedItem}
                    onItemClick={handleActivityOnClick}
                />
            </div>

            {/* DRAGGABLE RESIZER & RIGHT PANEL */}
            {selectedItem && (
                <>
                    <ResizerHandle onMouseDown={handleMouseDown} />
                    <ActivityDetail item={selectedItem} />
                </>
            )}
        </div>
    );
}
