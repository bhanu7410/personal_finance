"use client";

import { useState } from "react";
import { CategoryStat } from "./types";
import { formatCurrency } from "@/lib/utils";
import { X } from "lucide-react";

interface InteractiveSegmentedBarProps {
    stats: CategoryStat[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string | null) => void;
    totalSpent: number;
}

export function InteractiveSegmentedBar({
    stats,
    selectedCategoryId,
    onSelectCategory,
    totalSpent,
}: InteractiveSegmentedBarProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (totalSpent === 0) return null;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    Category Spending
                </h3>
                {selectedCategoryId && (
                    <button
                        onClick={() => onSelectCategory(null)}
                        className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-all active:scale-95"
                    >
                        <X className="h-3 w-3" />
                        Clear Filter
                    </button>
                )}
            </div>

            {/* The Actual Bar */}
            <div className="relative flex h-12 w-full gap-0.5 overflow-hidden rounded-2xl bg-gray-100 p-1 shadow-inner">
                {stats.map((stat) => {
                    const isSelected = selectedCategoryId === stat.id;
                    const isHovered = hoveredId === stat.id;
                    const isAnySelected = selectedCategoryId !== null;

                    return (
                        <div
                            key={stat.id}
                            onMouseEnter={() => setHoveredId(stat.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => onSelectCategory(isSelected ? null : stat.id)}
                            className={`group relative flex h-full cursor-pointer items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] first:rounded-l-xl last:rounded-r-xl overflow-hidden ${
                                isAnySelected && !isSelected ? "opacity-30 grayscale-[0.5]" : "opacity-100"
                            }`}
                            style={{ 
                                // Expand width if hovered or selected
                                width: (isHovered || isSelected) 
                                    ? `calc(${stat.percentage}% + 60px)` 
                                    : `${stat.percentage}%`,
                                backgroundColor: stat.color,
                                flexShrink: (isHovered || isSelected) ? 0 : 1,
                            }}
                        >
                            {/* Inline Amount - Fades in on hover/selection */}
                            <span className={`whitespace-nowrap px-3 text-[10px] font-black text-white transition-all duration-300 ${(isHovered || isSelected) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                                {formatCurrency(stat.amount)}
                            </span>

                            {/* Tooltip Background Glow */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    );
                })}
            </div>

            {/* Compact Legend */}
            <div className="flex flex-wrap gap-2">
                {stats.map((stat) => {
                    const isSelected = selectedCategoryId === stat.id;
                    const isHovered = hoveredId === stat.id;
                    return (
                        <button
                            key={stat.id}
                            onClick={() => onSelectCategory(isSelected ? null : stat.id)}
                            onMouseEnter={() => setHoveredId(stat.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 active:scale-95 ${
                                isSelected 
                                    ? "border-gray-900 bg-gray-900 text-white shadow-md ring-2 ring-gray-900/10" 
                                    : isHovered
                                        ? "border-gray-300 bg-gray-50 text-gray-900 scale-105"
                                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                            }`}
                        >
                            <span 
                                className="h-2 w-2 rounded-full" 
                                style={{ backgroundColor: isSelected ? "#fff" : stat.color }}
                            />
                            <span className="text-[10px] font-bold leading-none">
                                {stat.icon} {stat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
