"use client";

import { useState } from "react";
import { GroupListItem } from "./types";
import { GroupList } from "./GroupList";
import { GroupDetail } from "./GroupDetail";

interface GroupLayoutProps {
    initialData: GroupListItem[];
}

export function GroupLayout({ initialData }: GroupLayoutProps) {
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [leftPanelWidthPct, setLeftPanelWidthPct] = useState(68);
    const [isDragging, setIsDragging] = useState(false);

    // Filtering groups based on search query
    const filteredGroups = initialData.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const selectedGroup =
        initialData.find((g) => g.id === selectedGroupId) || null;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        const startX = e.clientX;
        const startWidthPct = leftPanelWidthPct;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPct = (deltaX / window.innerWidth) * 100;
            const newWidthPct = startWidthPct + deltaPct;
            setLeftPanelWidthPct(Math.max(25, Math.min(newWidthPct, 68)));
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
        <div className="flex h-[calc(100vh-200px)] w-full overflow-hidden">
            {/* LEFT PANEL */}
            <div
                className={`flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm ${
                    !selectedGroup ? "w-full" : ""
                } ${
                    !isDragging
                        ? "transition-[width] duration-300 ease-in-out"
                        : ""
                }`}
                style={
                    selectedGroup
                        ? { width: `${leftPanelWidthPct}%`, flexShrink: 0 }
                        : undefined
                }
            >
                <GroupList
                    groups={filteredGroups}
                    selectedGroupId={selectedGroupId}
                    onSelectGroup={(id) =>
                        setSelectedGroupId((prev) => (prev === id ? null : id))
                    }
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            {/* DRAGGABLE RESIZER & RIGHT PANEL */}
            {selectedGroup && (
                <>
                    <div
                        onMouseDown={handleMouseDown}
                        className={`group relative flex w-1.5 cursor-col-resize items-center justify-center transition-colors hover:bg-orange-500/20 ${
                            isDragging ? "bg-orange-500/30" : "bg-transparent"
                        }`}
                    >
                        <div
                            className={`h-8 w-1 rounded-full transition-colors ${
                                isDragging
                                    ? "bg-orange-500"
                                    : "bg-gray-300 group-hover:bg-orange-400"
                            }`}
                        />
                    </div>

                    <GroupDetail
                        group={selectedGroup}
                        onClose={() => setSelectedGroupId(null)}
                        isDragging={isDragging}
                    />
                </>
            )}
        </div>
    );
}
