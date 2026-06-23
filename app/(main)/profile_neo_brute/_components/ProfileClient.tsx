"use client";

import { useState, useTransition } from "react";
import { getProfileData } from "../_lib/getProfileData";
import { ProfileHero } from "./ProfileHero";
import { ProfileSummaryCards } from "./ProfileSummaryCards";
import { CashFlowBarChart } from "./CashFlowBarChart";
import { BalanceChart } from "@/components/BalanceChart";
import { CategoriesPieChart } from "@/components/CategoriesPieChart";
import { FriendLedger } from "./FriendLedger";
import { QuickInsights } from "./QuickInsights";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface ProfileClientProps {
    initialData: Awaited<ReturnType<typeof getProfileData>>;
    user: {
        name: string;
        primaryEmail: string;
        profileImageUrl?: string;
    };
}

export function ProfileClient({ initialData, user }: ProfileClientProps) {
    const [days, setDays] = useState<number | null>(null);
    const [data, setData] = useState(initialData);
    const [isPending, startTransition] = useTransition();

    const handleFilterChange = (newDays: number | null) => {
        if (newDays === days) return;
        setDays(newDays);
        startTransition(async () => {
            try {
                const freshData = await getProfileData(newDays);
                setData(freshData);
            } catch (error) {
                console.error("Failed to fetch filtered data", error);
            }
        });
    };

    return (
        <div className="space-y-12 pb-16 font-sans">
            <ProfileHero user={user} />
            <ProfileSummaryCards summary={data.financialSummary} />

            <QuickInsights insights={data.insights} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-full border-4 border-black bg-cyan-300 px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black uppercase text-black">Analytics Playground</h2>
                
                <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white p-1">
                    {[
                        { label: "30D", value: 30 },
                        { label: "1Y", value: 365 },
                        { label: "All", value: null },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => handleFilterChange(opt.value)}
                            className={`rounded-full px-4 py-1.5 text-sm font-black uppercase transition-all ${
                                days === opt.value
                                    ? "bg-black text-white"
                                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                    {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                    <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-black">Balance Trend</h3>
                    <div className="flex-1 min-h-[300px]">
                        <BalanceChart data={data.balanceTrend} />
                    </div>
                </div>

                <div className="flex flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                    <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-black">Category Spending</h3>
                    <div className="flex-1 min-h-[300px]">
                        <CategoriesPieChart data={data.categoryData} />
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex flex-col rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                    <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-black">Income vs Expenses</h3>
                    <div className="flex-1 min-h-[300px]">
                        <CashFlowBarChart data={data.cashFlowData} />
                    </div>
                </div>
            </div>

            <FriendLedger balances={data.friendBalances} />

            {/* Fun Transactions Button */}
            <div className="flex justify-center mt-12">
                <Link
                    href="/transactions"
                    className="group flex items-center gap-3 rounded-full border-4 border-black bg-lime-300 px-8 py-4 text-xl sm:text-2xl font-black uppercase text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:translate-x-2 hover:bg-lime-400 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                >
                    Let's see those transactions
                    <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
                </Link>
            </div>
        </div>
    );
}
