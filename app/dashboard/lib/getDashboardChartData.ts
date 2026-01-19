import { prisma } from "@/lib/prisma"; // Adjust path to your prisma instance

export async function getDashboardChartData(
    userId: string,
    currentBalance: number,
) {
    // 1. Fetch enough recent history to cover at least 10 active days
    // We take 50 items to be safe.
    const [transactions, payments] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                payerId: userId,
                deletedAt: null,
            },
            orderBy: { date: "desc" },
            take: 50,
            include: { category: true },
        }),
        prisma.payment.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            orderBy: { date: "desc" },
            take: 50,
        }),
    ]);

    // 2. Merge and format them into a single timeline
    const allActivity = [
        ...transactions.map((t) => ({
            date: t.date.toISOString().split("T")[0], // "2024-01-01"
            amount: t.amount.toNumber(),
            // If it's INCOME, it added to balance. If EXPENSE, it subtracted.
            effect: t.category?.type === "INCOME" ? "PLUS" : "MINUS",
        })),
        ...payments.map((p) => ({
            date: p.date.toISOString().split("T")[0],
            amount: p.amount.toNumber(),
            // If I am Receiver, it added to balance. If Sender, it subtracted.
            effect: p.receiverId === userId ? "PLUS" : "MINUS",
        })),
    ];

    // 3. Group by Date (Sum up daily changes)
    // Map: "2024-01-01" -> Net Change (+500 or -200)
    const dailyChanges = new Map<string, number>();

    allActivity.forEach((item) => {
        const currentChange = dailyChanges.get(item.date) || 0;
        const changeAmount =
            item.effect === "PLUS" ? item.amount : -item.amount;
        dailyChanges.set(item.date, currentChange + changeAmount);
    });

    // 4. Get unique dates and sort descending (Today -> Past)
    const activeDates = Array.from(dailyChanges.keys())
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .slice(0, 10); // Strictly take the last 10 ACTIVE days

    // 5. Calculate Balances Backwards
    // We start with the CURRENT balance.
    let runningBalance = currentBalance;
    const chartData = [];

    // Loop through active dates
    for (const date of activeDates) {
        // The balance at the END of this date is the runningBalance
        chartData.push({
            date: date,
            balance: runningBalance,
        });

        // Before moving to the previous date, we must "undo" this day's change
        // to find out what the balance was BEFORE this day started.
        const changeOnThisDay = dailyChanges.get(date) || 0;
        runningBalance = runningBalance - changeOnThisDay;
    }

    // 6. Reverse to Ascending Order (Oldest -> Newest) for the Chart
    return chartData.reverse();
}
