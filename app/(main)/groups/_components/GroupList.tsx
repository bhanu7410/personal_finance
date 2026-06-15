"use client";

import { GroupListItem } from "./types";
import { Search, Users, ExternalLink, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface GroupListProps {
    groups: GroupListItem[];
    selectedGroupId: string | null;
    onSelectGroup: (id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function GroupList({
    groups,
    selectedGroupId,
    onSelectGroup,
    searchQuery,
    onSearchChange,
}: GroupListProps) {
    return (
        <div className="flex h-full flex-col">
            {/* Search Header */}
            <div className="shrink-0 border-b border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {groups.map((group) => {
                        const isSelected = group.id === selectedGroupId;

                        return (
                            <div
                                key={group.id}
                                onClick={() => onSelectGroup(group.id)}
                                className={`group relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                                    isSelected
                                        ? "bg-orange-50 shadow-sm ring-1 ring-orange-200"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3
                                            className={`truncate font-semibold ${isSelected ? "text-orange-900" : "text-gray-900"}`}
                                        >
                                            {group.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1 font-medium">
                                                <Users className="h-3 w-3" />
                                                <span>
                                                    x {group.memberCount}
                                                </span>
                                            </div>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>
                                                Created{" "}
                                                {new Date(
                                                    group.createdAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {/* Hide amount if selected, per instructions */}
                                        {!isSelected && (
                                            <>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(
                                                        group.totalSpent,
                                                    )}
                                                </span>
                                                <Link
                                                    href={`/groups/${group.id}`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className={`rounded-full p-1.5 transition-colors ${
                                                        isSelected
                                                            ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                                            : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                                                    }`}
                                                    title="Open full page"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="mt-3 flex items-center justify-end">
                                        <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                                            Active Selection
                                            <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {groups.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-gray-50 p-4">
                                <Users className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                No groups found
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Try adjusting your search query.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
