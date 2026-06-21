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

    // Find the active parent stat (either selected directly, or because a child is selected)
    const activeParentStat = selectedCategoryId 
        ? stats.find(s => s.id === selectedCategoryId || s.subcategories?.some(sub => sub.id === selectedCategoryId))
        : null;

    const renderBarAndLegend = (
        items: CategoryStat[], 
        isSub: boolean,
        parentTotalAmount?: number
    ) => {
        return (
            <div className="w-full space-y-4">
                {/* The Actual Bar */}
                <div className={`relative flex gap-0.5 overflow-hidden rounded-2xl bg-gray-100 p-1 shadow-inner ${isSub ? "h-8" : "h-12"}`}>
                    {items.map((stat) => {
                        // For parent bar, it's selected if its id matches OR if one of its subcategories matches
                        const isSelected = selectedCategoryId === stat.id || (!isSub && stat.subcategories?.some(sub => sub.id === selectedCategoryId));
                        const isHovered = hoveredId === stat.id;
                        const isAnySelected = selectedCategoryId !== null;
                        
                        // For subcategories, percentage might need to be relative to parent if we want it to fill the bar
                        const displayPercentage = isSub && parentTotalAmount 
                            ? (stat.amount / parentTotalAmount) * 100 
                            : stat.percentage;

                        return (
                            <div
                                key={stat.id}
                                onMouseEnter={() => setHoveredId(stat.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => onSelectCategory(isSelected && selectedCategoryId === stat.id ? (isSub ? activeParentStat?.id || null : null) : stat.id)}
                                className={`group relative flex h-full cursor-pointer items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] first:rounded-l-xl last:rounded-r-xl overflow-hidden ${
                                    isAnySelected && !isSelected ? "opacity-30 grayscale-[0.5]" : "opacity-100"
                                }`}
                                style={{ 
                                    width: (isHovered || isSelected) 
                                        ? `calc(${displayPercentage}% + ${isSub ? '40px' : '60px'})` 
                                        : `${displayPercentage}%`,
                                    backgroundColor: stat.color,
                                    flexShrink: (isHovered || isSelected) ? 0 : 1,
                                }}
                            >
                                <span className={`whitespace-nowrap px-3 font-black text-white transition-all duration-300 ${(isHovered || isSelected) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} ${isSub ? "text-[8px]" : "text-[10px]"}`}>
                                    {formatCurrency(stat.amount)}
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>

                {/* Compact Legend */}
                <div className="flex flex-wrap gap-2">
                    {items.map((stat) => {
                        const isSelected = selectedCategoryId === stat.id || (!isSub && stat.subcategories?.some(sub => sub.id === selectedCategoryId));
                        const isHovered = hoveredId === stat.id;
                        return (
                            <button
                                key={stat.id}
                                onClick={() => onSelectCategory(isSelected && selectedCategoryId === stat.id ? (isSub ? activeParentStat?.id || null : null) : stat.id)}
                                onMouseEnter={() => setHoveredId(stat.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`flex items-center gap-2 rounded-full border transition-all duration-200 active:scale-95 ${isSub ? "px-2 py-1" : "px-3 py-1.5"} ${
                                    isSelected 
                                        ? "text-white shadow-md ring-2 ring-gray-900/10" 
                                        : isHovered
                                            ? "scale-105"
                                            : "border-gray-100 bg-white text-gray-500"
                                }`}
                                style={{
                                    ...(isSelected && { backgroundColor: stat.color, borderColor: stat.color }),
                                    ...(isHovered && !isSelected && { borderColor: stat.color, color: stat.color, backgroundColor: `${stat.color}15` }),
                                }}
                            >
                                <span 
                                    className="rounded-full" 
                                    style={{ 
                                        backgroundColor: isSelected ? "#fff" : stat.color,
                                        width: isSub ? "6px" : "8px",
                                        height: isSub ? "6px" : "8px"
                                    }}
                                />
                                <span className={`font-bold leading-none ${isSub ? "text-[9px]" : "text-[10px]"}`} style={{ color: "inherit" }}>
                                    {stat.icon} {stat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

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

            {renderBarAndLegend(stats, false)}

            {activeParentStat && (
                <div className="pt-2">
                    <div className="mb-4 h-px w-full bg-gray-100" />
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[9px] font-black tracking-widest text-gray-400 uppercase">
                            Subcategories for {activeParentStat.name}
                        </h4>
                    </div>
                    {activeParentStat.subcategories && activeParentStat.subcategories.length > 0 ? (
                        renderBarAndLegend(activeParentStat.subcategories, true, activeParentStat.amount)
                    ) : (
                        <p className="text-xs font-medium text-gray-400 italic bg-gray-50 rounded-xl p-3 text-center border border-gray-100 border-dashed">
                            No subcategories
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
