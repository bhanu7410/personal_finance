"use client";

import { useState, useMemo } from "react";
import { GroupTransaction, GroupMember, CategoryStat } from "./types";
import { InteractiveSegmentedBar } from "./InteractiveSegmentedBar";
import { GroupTransactionsTable } from "./GroupTransactionsTable";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Users as UsersIcon, ChevronRight } from "lucide-react";

interface GroupDashboardClientProps {
    transactions: GroupTransaction[];
    members: GroupMember[];
    currency: string;
}

export function GroupDashboardClient({
    transactions,
    members,
    currency,
}: GroupDashboardClientProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // 1. All-time Category Stats (Unfiltered) for the Bar Chart
    const categoryStats = useMemo(() => {
        const statsMap = new Map<string, { id: string; name: string; icon: string | null; amount: number }>();
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        
        transactions.forEach((txn) => {
            const catId = txn.category?.id || "uncategorized";
            const current = statsMap.get(catId) || { 
                id: catId, 
                name: txn.category?.name || "Uncategorized", 
                icon: txn.category?.icon || "📄", 
                amount: 0 
            };
            current.amount += txn.amount;
            statsMap.set(catId, current);
        });

        const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#6366f1"];

        return Array.from(statsMap.values())
            .map((stat, idx) => ({
                ...stat,
                percentage: total > 0 ? (stat.amount / total) * 100 : 0,
                color: colors[idx % colors.length]
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    // 2. Filter data based on selection
    const activeTransactions = useMemo(() => {
        if (!selectedCategoryId) return transactions;
        return transactions.filter(t => (t.category?.id || "uncategorized") === selectedCategoryId);
    }, [transactions, selectedCategoryId]);

    const activeTotalSpent = useMemo(() => {
        return activeTransactions.reduce((sum, t) => sum + t.amount, 0);
    }, [activeTransactions]);

    // 3. Member Spending (Smart Casual) - Filtered by active selection
    const memberSpending = useMemo(() => {
        return members.map(member => {
            const spent = activeTransactions
                .filter(t => t.payer.id === member.id)
                .reduce((sum, t) => sum + t.amount, 0);
            return { ...member, spent };
        }).sort((a, b) => b.spent - a.spent);
    }, [members, activeTransactions]);

    // 4. Final Table Data (Top 50)
    const topTransactions = useMemo(() => {
        return activeTransactions.slice(0, 50);
    }, [activeTransactions]);

    return (
        <div className="flex flex-col gap-10">
            {/* 1. TOP: INTERACTIVE BAR */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <InteractiveSegmentedBar 
                    stats={categoryStats} 
                    selectedCategoryId={selectedCategoryId} 
                    onSelectCategory={setSelectedCategoryId}
                    totalSpent={transactions.reduce((sum, t) => sum + t.amount, 0)}
                />
            </section>

            {/* 2. METRICS & MEMBER LIST (SMART CASUAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Total Spent Card */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        <Wallet className="h-3 w-3 text-orange-500" />
                        {selectedCategoryId ? "Filtered Total" : "Total Group Spend"}
                    </div>
                    <div className="text-5xl font-black tracking-tighter text-gray-900">
                        {formatCurrency(activeTotalSpent)}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {selectedCategoryId ? `Spending for ${categoryStats.find(c => c.id === selectedCategoryId)?.name || "category"}` : `Across all activities`}
                    </p>
                </div>

                {/* Member List (Smart Casual) */}
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase flex items-center gap-2">
                        <UsersIcon className="h-3 w-3" />
                        Member Spending
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-4">
                        {memberSpending.map((member, idx) => (
                            <div key={member.id} className="flex items-center">
                                <div className="flex items-center gap-2.5 px-1">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 ring-2 ring-white shadow-sm">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-900 leading-none">{member.name}</span>
                                        <span className="text-[11px] font-black text-orange-600 mt-0.5 tracking-tight">
                                            {formatCurrency(member.spent)}
                                        </span>
                                    </div>
                                </div>
                                {idx < memberSpending.length - 1 && (
                                    <div className="mx-4 h-6 w-px bg-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. ACTIVITY TABLE (TOP 50) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Recent Activity {selectedCategoryId && "(Filtered)"}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400">
                        Showing top {topTransactions.length} items
                    </span>
                </div>
                <GroupTransactionsTable data={topTransactions} />
            </div>
        </div>
    );
}
