"use client";

import { useState, useMemo } from "react";
import { getProfileData } from "../_lib/getProfileData";
import { ArrowUpDown, Users2 } from "lucide-react";

interface FriendBalancesProps {
    initialData: Awaited<ReturnType<typeof getProfileData>>;
}

type SortOrder = "you-owe-first" | "owes-you-first";

export function FriendBalances({ initialData }: FriendBalancesProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("you-owe-first");
    const { friendBalances } = initialData;

    const sortedBalances = useMemo(() => {
        if (!friendBalances) return [];
        return [...friendBalances].sort((a, b) => {
            if (sortOrder === "you-owe-first") {
                if (a.netBalance < 0 && b.netBalance >= 0) return -1;
                if (a.netBalance >= 0 && b.netBalance < 0) return 1;
                return Math.abs(b.netBalance) - Math.abs(a.netBalance);
            } else {
                if (a.netBalance > 0 && b.netBalance <= 0) return -1;
                if (a.netBalance <= 0 && b.netBalance > 0) return 1;
                return Math.abs(b.netBalance) - Math.abs(a.netBalance);
            }
        });
    }, [friendBalances, sortOrder]);

    if (!sortedBalances || sortedBalances.length === 0) {
        return null;
    }

    return (
        <div className="mx-auto mt-6 w-full max-w-5xl space-y-5">
            <div className="flex flex-col justify-between gap-4 px-1 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-xl font-semibold tracking-tight text-neutral-800">
                        Friends Balances
                    </h3>
                </div>

                <button
                    onClick={() =>
                        setSortOrder((prev) =>
                            prev === "you-owe-first"
                                ? "owes-you-first"
                                : "you-owe-first",
                        )
                    }
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200/60 transition-all hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
                >
                    <ArrowUpDown className="h-4 w-4" />
                    <span>
                        {sortOrder === "you-owe-first"
                            ? "Showing: You Owe First"
                            : "Showing: Owes You First"}
                    </span>
                </button>
            </div>

            {/* Added p-2 -mx-2 to prevent soft shadow clipping */}
            <div className="custom-scrollbar -mx-2 flex max-h-115 flex-col gap-4 overflow-y-auto p-2">
                {sortedBalances.map((friend) => (
                    <div
                        key={friend.id}
                        className={`group relative flex items-center justify-between rounded-2xl border-l-[6px] bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                            friend.netBalance > 0
                                ? "border-l-emerald-400 ring-1 ring-emerald-100 hover:ring-emerald-200/60"
                                : "border-l-rose-400 ring-1 ring-rose-100 hover:ring-rose-200/60"
                        }`}
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                                    friend.netBalance > 0
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-rose-50 text-rose-600"
                                }`}
                            >
                                {friend.name.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="truncate text-lg font-semibold text-neutral-900">
                                {friend.name}
                            </h4>
                        </div>

                        <div className="flex shrink-0 flex-col items-end">
                            {friend.netBalance > 0 ? (
                                <>
                                    <span className="text-xs font-medium tracking-wider text-emerald-600/70 uppercase">
                                        Owes You
                                    </span>
                                    <span className="text-lg font-semibold text-emerald-600">
                                        $
                                        {Math.abs(friend.netBalance).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-medium tracking-wider text-rose-600/70 uppercase">
                                        You Owe
                                    </span>
                                    <span className="text-lg font-semibold text-rose-600">
                                        $
                                        {Math.abs(friend.netBalance).toFixed(2)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e5e5;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #d4d4d8;
                }
            `}</style>
        </div>
    );
}
