import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserFinancialSummary } from "@/lib/accountBalance";
import { getDashboardChartData } from "./_lib/getDashboardChartData";
import { getCategoryStats } from "./_lib/getCategoryStats"; // <--- NEW IMPORT
import { BalanceChart } from "@/components/BalanceChart";
import { CategoriesPieChart } from "@/components/CategoriesPieChart";

import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownLeft,
} from "lucide-react";

// Helper for cleaner currency display
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
    }).format(amount);
};

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();
    if (!currentUser) return <div>Please Log In</div>;

    const currentUserId = currentUser.id;

    // 1. PARALLEL DATA FETCHING
    const [
        totalTransactionsCount,
        recentTransactions,
        recentPayments,
        financialSummary,
        categoryStats, // <--- NEW DATA VARIABLE
    ] = await Promise.all([
        prisma.transaction.count({ where: { payerId: currentUserId } }),
        prisma.transaction.findMany({
            where: { payerId: currentUserId },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { category: true },
        }),
        prisma.payment.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { receiver: true, sender: true },
        }),
        getUserFinancialSummary(currentUserId),
        getCategoryStats(currentUserId), // <--- FETCHING PIE DATA
    ]);

    // 2. FETCH CHART DATA
    const currentCash = financialSummary.realized.currentCashBalance;
    const chartData = await getDashboardChartData(currentUserId, currentCash);

    // 3. MERGE RECENT ACTIVITY
    const recentActivity = [
        ...recentTransactions.map((txn) => ({
            id: txn.id,
            type: "transaction",
            name: txn.category?.name || "Uncategorized",
            desc: txn.description,
            amount: txn.amount.toNumber(),
            date: txn.createdAt,
            isIncome: txn.category?.type === "INCOME",
        })),
        ...recentPayments.map((pmt) => {
            const isIncoming = pmt.receiverId === currentUserId;
            return {
                id: pmt.id,
                type: "payment",
                name: isIncoming
                    ? `From ${pmt.sender.name}`
                    : `To ${pmt.receiver.name}`,
                desc: "Payment",
                amount: pmt.amount.toNumber(),
                date: pmt.createdAt,
                isIncome: isIncoming,
            };
        }),
    ]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            {/* Header */}
            <div className="mb-6 shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Welcome back, {currentUser.name}
                </p>
            </div>

            {/* 1. Key Metrics (Top Row) */}
            <div className="mb-6 grid shrink-0 grid-cols-1 gap-6 md:grid-cols-3">
                {/* Metric 1 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Transactions
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            {totalTransactionsCount}
                        </span>
                        <div className="flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                            <TrendingUp className="mr-1 h-3 w-3" /> Month
                        </div>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        You Owe
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(
                                financialSummary.unrealized.amountIOwe,
                            )}
                        </span>
                        {financialSummary.unrealized.amountIOwe > 0 && (
                            <div className="flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                                <TrendingDown className="mr-1 h-3 w-3" /> Debt
                            </div>
                        )}
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Current Cash
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(
                                financialSummary.realized.currentCashBalance,
                            )}
                        </span>
                        <div className="flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                            <TrendingUp className="mr-1 h-3 w-3" /> Total
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid (Fills remaining height) */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT COLUMN: Recent Activity (Scrollable) */}
                <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="shrink-0 border-b border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900">
                            Recent Activity
                        </h2>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto p-5">
                        {recentActivity.map((item) => (
                            <div
                                key={`${item.type}-${item.id}`}
                                className="group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`rounded-full p-2 transition-colors ${item.isIncome ? "bg-green-100 group-hover:bg-green-200" : "bg-red-50 group-hover:bg-red-100"}`}
                                    >
                                        {item.isIncome ? (
                                            <ArrowDownLeft
                                                className={`h-4 w-4 ${item.isIncome ? "text-green-600" : "text-red-600"}`}
                                            />
                                        ) : (
                                            <ArrowUpRight
                                                className={`h-4 w-4 ${item.isIncome ? "text-green-600" : "text-red-600"}`}
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
                                        className={`text-sm font-semibold ${item.isIncome ? "text-green-600" : "text-gray-900"}`}
                                    >
                                        {item.isIncome ? "+" : "-"}
                                        {formatCurrency(item.amount)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(
                                            item.date,
                                        ).toLocaleDateString("en-US")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Split Top/Bottom */}
                <div className="flex min-h-0 flex-col gap-6">
                    {/* Top Right: Line Chart */}
                    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white pb-5 shadow-sm">
                        <h2 className="mb-4 shrink-0 border-b border-neutral-100 px-5 pt-5 pb-1 font-semibold text-gray-900">
                            Balance History (10 Days)
                        </h2>
                        <BalanceChart data={chartData} />
                    </div>

                    {/* Bottom Right: Pie Chart */}
                    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white pb-5 shadow-sm">
                        <h2 className="mb-4 shrink-0 border-b border-neutral-100 px-5 pt-5 pb-1 font-semibold text-gray-900">
                            Spending by Category
                        </h2>
                        <CategoriesPieChart data={categoryStats} />
                    </div>
                </div>
            </div>
        </main>
    );
}
