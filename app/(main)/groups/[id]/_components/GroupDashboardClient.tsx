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
        const parentStatsMap = new Map<string, any>();
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        
        transactions.forEach((txn) => {
            const cat = txn.category;
            const isSub = !!cat?.parentId;
            const parentId = isSub ? cat.parentId! : (cat?.id || "uncategorized");
            
            // Get or create parent stat
            let parentStat = parentStatsMap.get(parentId);
            if (!parentStat) {
                parentStat = {
                    id: parentId,
                    name: isSub ? (cat.parentName || "Unknown Parent") : (cat?.name || "Uncategorized"),
                    icon: isSub ? (cat.parentIcon || "📁") : (cat?.icon || "📄"),
                    amount: 0,
                    subStatsMap: new Map<string, any>()
                };
                parentStatsMap.set(parentId, parentStat);
            }
            
            parentStat.amount += txn.amount;
            
            // Track subcategory
            if (isSub) {
                let subStat = parentStat.subStatsMap.get(cat.id);
                if (!subStat) {
                    subStat = { id: cat.id, name: cat.name, icon: cat.icon, amount: 0 };
                    parentStat.subStatsMap.set(cat.id, subStat);
                }
                subStat.amount += txn.amount;
            } else if (cat) {
                let subStat = parentStat.subStatsMap.get("general");
                if (!subStat) {
                    subStat = { id: "general", name: "General", icon: cat.icon, amount: 0 };
                    parentStat.subStatsMap.set("general", subStat);
                }
                subStat.amount += txn.amount;
            }
        });

        // Dynamic distinct colors for parents using chroma
        const parents = Array.from(parentStatsMap.values()).sort((a, b) => b.amount - a.amount);
        const baseColors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#6366f1"];
        
        // If there are more parents than base colors, generate a scale
        let parentColors = baseColors;
        // Require chroma inline if not imported at top to avoid messing up imports if multiple chunks used
        const chroma = require("chroma-js");
        if (parents.length > baseColors.length) {
            parentColors = chroma.scale(['#f97316', '#3b82f6', '#10b981', '#ec4899']).mode('lch').colors(parents.length);
        }

        return parents.map((parentStat, idx) => {
            const parentColor = parentColors[idx % parentColors.length];
            const subStats = Array.from(parentStat.subStatsMap.values()).sort((a: any, b: any) => b.amount - a.amount);
            
            let subColors = [parentColor];
            if (subStats.length > 1) {
                subColors = chroma.scale([chroma(parentColor).darken(1), chroma(parentColor).brighten(1)]).colors(subStats.length);
            }

            const subcategories = subStats.map((sub: any, subIdx) => ({
                id: sub.id,
                name: sub.name,
                icon: sub.icon,
                amount: sub.amount,
                percentage: (sub.amount / parentStat.amount) * 100,
                color: subColors[subIdx]
            }));

            // Only consider it having subcategories if there's more than just the "General" one
            const hasActualSubcategories = subcategories.length > 1 || (subcategories.length === 1 && subcategories[0].id !== "general");

            return {
                id: parentStat.id,
                name: parentStat.name,
                icon: parentStat.icon,
                amount: parentStat.amount,
                percentage: total > 0 ? (parentStat.amount / total) * 100 : 0,
                color: parentColor,
                subcategories: hasActualSubcategories ? subcategories : undefined
            };
        });
    }, [transactions]);

    // 2. Filter data based on selection
    const activeTransactions = useMemo(() => {
        if (!selectedCategoryId) return transactions;
        return transactions.filter(t => {
            const catId = t.category?.id || "uncategorized";
            const parentId = t.category?.parentId;
            return catId === selectedCategoryId || parentId === selectedCategoryId;
        });
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
