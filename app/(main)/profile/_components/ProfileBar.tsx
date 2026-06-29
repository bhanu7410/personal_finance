"use client";
import { getProfileData } from "../_lib/getProfileData";
import Image from "next/image";
import {
    CheckCircle2,
    TrendingDown,
    TrendingUp,
    Sparkles,
    CreditCard,
    Users,
    LayoutGrid,
} from "lucide-react";

interface ProfileBarProps {
    initialData: Awaited<ReturnType<typeof getProfileData>>;
    user: {
        name: string;
        primaryEmail: string;
        profileImageUrl?: string;
    };
}

export function ProfileBar({ initialData, user }: ProfileBarProps) {
    const sumOwed: number = parseFloat(
        initialData.friendBalances
            .reduce((sum, item) => sum + item.netBalance, 0)
            .toFixed(2),
    );

    const sumSpent: number = parseFloat(
        initialData.cashFlowData
            .reduce((sum, item) => sum + item.Expense, 0)
            .toFixed(2),
    );

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            {/* Main Profile Card - Soft & Modern */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[-8px_-8px_0px_0px_rgba(255,189,0,1)] duration-200 hover:border-4 hover:border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        {user.profileImageUrl ? (
                            <Image
                                src={user.profileImageUrl}
                                alt={user.name}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="text-4xl font-semibold text-neutral-400">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                                {user.name}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-neutral-500">
                                {user.primaryEmail}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                            <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2 ring-1 ring-neutral-200/60">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-semibold text-neutral-700">
                                    {initialData.friendBalances.length} Friends
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2 ring-1 ring-neutral-200/60">
                                <LayoutGrid className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-semibold text-neutral-700">
                                    {initialData.insights.noOfGroups} Groups
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full shrink-0 pt-4 md:w-auto md:pt-0">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-linear-to-br from-neutral-50 to-neutral-100 p-6 shadow-inner ring-1 ring-neutral-200/50">
                            <div className="mb-1 flex items-center gap-2 text-neutral-500">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-xs font-semibold tracking-wider uppercase">
                                    Total Spent
                                </span>
                            </div>
                            <span className="text-3xl font-bold tracking-tight text-neutral-800">
                                ${sumSpent.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary / Status Block - Elegant & Soft */}
            <div
                className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 ${
                    sumOwed < 0
                        ? "bg-rose-50 ring-1 ring-rose-200"
                        : sumOwed > 0
                          ? "bg-emerald-50 ring-1 ring-emerald-200"
                          : "bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 ring-1 ring-indigo-100"
                }`}
            >
                <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-6">
                        <div
                            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ${
                                sumOwed < 0
                                    ? "text-rose-500 ring-rose-200"
                                    : sumOwed > 0
                                      ? "text-emerald-500 ring-emerald-200"
                                      : "text-indigo-500 ring-indigo-200"
                            }`}
                        >
                            {sumOwed < 0 ? (
                                <TrendingDown className="h-8 w-8" />
                            ) : sumOwed > 0 ? (
                                <TrendingUp className="h-8 w-8" />
                            ) : (
                                <Sparkles className="h-8 w-8" />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h3
                                className={`text-2xl font-bold tracking-tight ${
                                    sumOwed < 0
                                        ? "text-rose-950"
                                        : sumOwed > 0
                                          ? "text-emerald-950"
                                          : "text-indigo-950"
                                }`}
                            >
                                {sumOwed < 0
                                    ? "You're in the red"
                                    : sumOwed > 0
                                      ? "You're in the green"
                                      : "All Caught Up!"}
                            </h3>
                            <p
                                className={`mt-1 text-base font-medium ${
                                    sumOwed < 0
                                        ? "text-rose-700/80"
                                        : sumOwed > 0
                                          ? "text-emerald-700/80"
                                          : "text-indigo-700/80"
                                }`}
                            >
                                {sumOwed < 0
                                    ? `You owe a total of $${Math.abs(sumOwed).toFixed(2)}`
                                    : sumOwed > 0
                                      ? `Friends owe you $${sumOwed.toFixed(2)}`
                                      : "Great job! Your ledger is perfectly balanced."}
                            </p>
                        </div>
                    </div>

                    {sumOwed === 0 && (
                        <div className="hidden items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 shadow-sm ring-1 ring-indigo-200/50 backdrop-blur-md md:flex">
                            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                            <span className="font-semibold text-indigo-900">
                                Financial peace achieved
                            </span>
                        </div>
                    )}
                </div>

                {sumOwed === 0 && (
                    <>
                        <div className="absolute top-0 right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                        <div className="absolute right-[25%] bottom-0 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
                    </>
                )}
            </div>
        </div>
    );
}
