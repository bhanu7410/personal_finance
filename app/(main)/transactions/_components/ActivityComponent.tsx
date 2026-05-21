"use client";

import { ArrowUpRight, ArrowDownLeft, GripVertical } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CategoryData {
    id: string;
    type: string;
    name: string;
    desc: string;
    amount: number;
    date: Date;
    isIncome: boolean;
}

export function ActivityComponent({ data }: { data: CategoryData[] }) {
    const [selectedItem, setSelectedItem] = useState<CategoryData | null>(null);

    const [leftPanelWidthPct, setLeftPanelWidthPct] = useState(40);

    function handleActivityOnClick(item: CategoryData) {
        setSelectedItem((prev) => (prev?.id === item.id ? null : item));
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidthPct = leftPanelWidthPct;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            // 1. Calculate how many pixels the mouse moved
            const deltaX = moveEvent.clientX - startX;

            // 2. Convert that pixel movement into a percentage of the window width
            const deltaPct = (deltaX / window.innerWidth) * 100;

            const newWidthPct = startWidthPct + deltaPct;

            // 3. Constrain the width between 25% and 75% of the screen
            setLeftPanelWidthPct(Math.max(25, Math.min(newWidthPct, 75)));
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "col-resize";
    };

    return (
        <div className="flex h-[calc(100vh-100px)] w-full">
            {/* LEFT PANEL: Dynamically fill width when nothing is selected */}
            <div
                className={`flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm ${
                    !selectedItem ? "w-full" : ""
                }`}
                // Only apply the fixed pixel width if the side panel is open
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
                <div className="max-h-full flex-1 space-y-4 overflow-y-auto px-2 py-5">
                    {data.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className={`group m-0 flex items-center justify-between rounded-2xl px-2 py-1 transition duration-400 ease-in-out hover:cursor-pointer hover:bg-blue-50 ${
                                selectedItem?.id === item.id
                                    ? "border-4 border-dashed border-orange-400 bg-orange-100"
                                    : ""
                            }`}
                            onClick={() => handleActivityOnClick(item)}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`rounded-full p-2 transition-colors ${
                                        item.isIncome
                                            ? "bg-green-100 group-hover:bg-green-200"
                                            : "bg-red-50 group-hover:bg-red-100"
                                    }`}
                                >
                                    {item.isIncome ? (
                                        <ArrowDownLeft
                                            className={`h-4 w-4 text-green-600`}
                                        />
                                    ) : (
                                        <ArrowUpRight
                                            className={`h-4 w-4 text-red-600`}
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`text-sm font-semibold ${
                                        item.isIncome
                                            ? "text-green-600"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {item.isIncome ? "+" : "-"}
                                    {formatCurrency(item.amount)}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(item.date).toLocaleDateString(
                                        "en-US",
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DRAGGABLE RESIZER & RIGHT PANEL */}
            {selectedItem && (
                <>
                    {/* Resizer Handle */}
                    <div
                        className="group flex w-4 cursor-col-resize items-center justify-center transition-colors hover:bg-gray-100/50"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="flex h-8 w-1.5 items-center justify-center rounded-full bg-gray-200 group-hover:bg-gray-400">
                            <GripVertical className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* RIGHT PANEL: Detail View */}
                    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white py-6 shadow-sm">
                        <div className="mb-4 border-b border-gray-100 px-6 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Transaction Details
                            </h2>
                        </div>
                        <div className="space-y-4 px-6">
                            <div>
                                <div className="text-sm text-gray-500">
                                    Name
                                </div>
                                <div className="font-medium text-gray-900">
                                    {selectedItem.name}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Description
                                </div>
                                <div className="font-medium text-gray-900">
                                    {selectedItem.desc}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Amount
                                </div>
                                <div
                                    className={`font-semibold ${selectedItem.isIncome ? "text-green-600" : "text-red-600"}`}
                                >
                                    {selectedItem.isIncome ? "+" : "-"}
                                    {formatCurrency(selectedItem.amount)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Date
                                </div>
                                <div className="font-medium text-gray-900">
                                    {new Date(
                                        selectedItem.date,
                                    ).toLocaleDateString("en-US")}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
