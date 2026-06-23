"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardChartData } from "../../dashboard/_lib/getDashboardChartData";
import { getUserFinancialSummary } from "@/lib/accountBalance";

export async function getProfileData(days: number | null) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");
    const userId = currentUser.id;

    // Date filter logic
    const dateFilter = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;
    const whereClauseDate = dateFilter ? { gte: dateFilter } : undefined;

    // 1. Fetch Category Stats
    const expenseStats = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
            payerId: userId,
            category: { type: "EXPENSE" },
            deletedAt: null,
            ...(whereClauseDate && { date: whereClauseDate })
        },
        _sum: { amount: true },
    });

    const paymentStats = await prisma.payment.aggregate({
        where: {
            senderId: userId,
            ...(whereClauseDate && { date: whereClauseDate })
        },
        _sum: { amount: true },
    });

    const categoryIds = expenseStats.map(s => s.categoryId).filter((id): id is string => id !== null);
    const categoryDetails = await prisma.category.findMany({ where: { id: { in: categoryIds } } });

    const formattedCategories = expenseStats.map((stat) => {
        const category = categoryDetails.find((c) => c.id === stat.categoryId);
        return {
            name: category?.name || "Uncategorized",
            value: stat._sum.amount?.toNumber() || 0,
        };
    });

    const totalPayments = paymentStats._sum.amount?.toNumber() || 0;
    if (totalPayments > 0) {
        formattedCategories.push({ name: "Payments / Settlements", value: totalPayments });
    }

    const categoryData = formattedCategories
        .filter((stat) => stat.value > 0)
        .sort((a, b) => b.value - a.value);

    // 2. Fetch Cash Flow (Income vs Expense)
    const [transactions, payments] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                payerId: userId,
                deletedAt: null,
                ...(whereClauseDate && { date: whereClauseDate })
            },
            include: { category: true }
        }),
        prisma.payment.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
                ...(whereClauseDate && { date: whereClauseDate })
            }
        })
    ]);

    const cashFlowRaw = [
        ...transactions.map(t => ({
            date: t.date.toISOString().split("T")[0],
            amount: t.amount.toNumber(),
            type: t.category?.type === "INCOME" ? "INCOME" : "EXPENSE"
        })),
        ...payments.map(p => ({
            date: p.date.toISOString().split("T")[0],
            amount: p.amount.toNumber(),
            type: p.receiverId === userId ? "INCOME" : "EXPENSE"
        }))
    ];

    // Group cash flow by Date or Month depending on the range
    // To keep it simple for the bar chart, we group by month (YYYY-MM)
    const cashFlowMap = new Map<string, { income: number; expense: number }>();
    cashFlowRaw.forEach(item => {
        const monthKey = item.date.substring(0, 7); // "YYYY-MM"
        const current = cashFlowMap.get(monthKey) || { income: 0, expense: 0 };
        if (item.type === "INCOME") current.income += item.amount;
        else current.expense += item.amount;
        cashFlowMap.set(monthKey, current);
    });

    const cashFlowData = Array.from(cashFlowMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => ({
            month,
            Income: data.income,
            Expense: data.expense
        }));

    // 3. Overall Balance (Always All-Time for the Summary Cards)
    const financialSummary = await getUserFinancialSummary(userId);

    // 4. Balance Trend Chart
    const balanceTrend = await getDashboardChartData(userId, financialSummary.realized.currentCashBalance);

    // 5. Friend Balances (Who owes me / who I owe)
    const [lentSplits, borrowedSplits, paymentsSent, paymentsReceived] = await Promise.all([
        prisma.split.findMany({
            where: { transaction: { payerId: userId, deletedAt: null }, userId: { not: userId } },
            include: { user: true }
        }),
        prisma.split.findMany({
            where: { userId: userId, transaction: { payerId: { not: userId }, deletedAt: null } },
            include: { transaction: { include: { payer: true } } }
        }),
        prisma.payment.findMany({
            where: { senderId: userId },
            include: { receiver: true }
        }),
        prisma.payment.findMany({
            where: { receiverId: userId },
            include: { sender: true }
        })
    ]);

    const friendLedger = new Map<string, { id: string; name: string; netBalance: number }>();

    const getFriend = (id: string, name: string) => {
        if (!friendLedger.has(id)) {
            friendLedger.set(id, { id, name: name || "Unknown", netBalance: 0 });
        }
        return friendLedger.get(id)!;
    };

    lentSplits.forEach(s => getFriend(s.userId, s.user.name || "").netBalance += s.amount.toNumber());
    borrowedSplits.forEach(s => getFriend(s.transaction.payerId, s.transaction.payer.name || "").netBalance -= s.amount.toNumber());
    paymentsReceived.forEach(p => getFriend(p.senderId, p.sender.name || "").netBalance -= p.amount.toNumber());
    paymentsSent.forEach(p => getFriend(p.receiverId, p.receiver.name || "").netBalance += p.amount.toNumber());

    const friendBalances = Array.from(friendLedger.values())
        .filter(f => Math.abs(f.netBalance) > 0.01)
        .sort((a, b) => b.netBalance - a.netBalance);

    // 6. Insights
    const highestCategory = categoryData.length > 0 ? categoryData[0] : null;
    const insights = {
        highestCategory
    };

    return {
        categoryData,
        cashFlowData,
        balanceTrend,
        financialSummary,
        friendBalances,
        insights
    };
}
