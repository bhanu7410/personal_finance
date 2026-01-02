import { prisma } from "./prisma";

export async function getUserFinancialSummary(userId: string) {
    // We use Promise.all to run all queries in parallel for performance
    const [
        // 1. CASH OUT: Total amount you physically paid for EXPENSES (full bill amount)
        expenseTxns,
        // 2. CASH IN: Total amount you received as INCOME
        incomeTxns,
        // 3. SETTLEMENTS OUT: Money you sent to friends
        sentPayments,
        // 4. SETTLEMENTS IN: Money friends sent to you
        receivedPayments,
        // 5. UNREALIZED (LENT): Splits others owe you (from txns you paid)
        lentSplits,
        // 6. UNREALIZED (BORROWED): Splits you owe others (from txns they paid)
        borrowedSplits,
    ] = await Promise.all([
        // Query 1
        prisma.transaction.aggregate({
            where: {
                payerId: userId,
                deletedAt: null,
                category: { type: "EXPENSE" },
            },
            _sum: { amount: true },
        }),
        // Query 2
        prisma.transaction.aggregate({
            where: {
                payerId: userId,
                deletedAt: null,
                category: { type: "INCOME" },
            },
            _sum: { amount: true },
        }),
        // Query 3
        prisma.payment.aggregate({
            where: { senderId: userId },
            _sum: { amount: true },
        }),
        // Query 4
        prisma.payment.aggregate({
            where: { receiverId: userId },
            _sum: { amount: true },
        }),
        // Query 5
        prisma.split.aggregate({
            where: {
                transaction: { payerId: userId, deletedAt: null },
                userId: { not: userId },
            },
            _sum: { amount: true },
        }),
        // Query 6
        prisma.split.aggregate({
            where: {
                userId: userId,
                transaction: { payerId: { not: userId }, deletedAt: null },
            },
            _sum: { amount: true },
        }),
    ]);

    // --- 1. PARSE VALUES (Handle nulls safely) ---
    const totalPaidOut = expenseTxns._sum.amount?.toNumber() || 0;
    const totalIncomeIn = incomeTxns._sum.amount?.toNumber() || 0;

    const settlementsSent = sentPayments._sum.amount?.toNumber() || 0;
    const settlementsReceived = receivedPayments._sum.amount?.toNumber() || 0;

    const amountOwedToMe = lentSplits._sum.amount?.toNumber() || 0;
    const amountIOwe = borrowedSplits._sum.amount?.toNumber() || 0;

    // --- 2. CALCULATE REALIZED BALANCE (Cash Flow) ---
    // Formula: (Income + Settlements In) - (Full Bills Paid + Settlements Out)
    // This represents the physical change in your bank account since using the app.
    const currentCashBalance =
        totalIncomeIn + settlementsReceived - (totalPaidOut + settlementsSent);

    // --- 3. CALCULATE UNREALIZED BALANCE (Pending Debts) ---
    // This is your "Splitwise" standing.
    // Positive = Friends owe you more. Negative = You owe friends more.
    const netPendingDebt = amountOwedToMe - amountIOwe;

    // --- 4. CALCULATE NET WORTH ---
    // If everyone paid you back today, and you paid everyone back today, this is what you'd have.
    const totalNetPosition = currentCashBalance + netPendingDebt;

    return {
        // A. The "Bank Account" View
        realized: {
            description: "Physical cash flow (Money In - Money Out)",
            totalIncome: totalIncomeIn,
            totalExpensesPaid: totalPaidOut, // The full bill amounts you swiped card for
            settlementsReceived,
            settlementsSent,
            currentCashBalance, // "How much do I have now?" (Relative to 0)
        },

        // B. The "Social/Split" View
        unrealized: {
            description: "Pending debts not yet settled",
            amountOwedToMe, // You lent this
            amountIOwe, // You borrowed this
            netPendingDebt, // (Owed To Me - I Owe)
        },

        // C. The "Big Picture"
        summary: {
            description: "Your total financial standing",
            totalNetPosition, // Realized Cash + Pending Debts
        },
    };
}
