import { prisma } from "@/lib/prisma";

export async function getCategoryStats(userId: string) {
    // 1. Run Aggregations in Parallel
    const [expenseStats, paymentStats] = await Promise.all([
        // A. Group Transactions by Category
        prisma.transaction.groupBy({
            by: ["categoryId"],
            where: {
                payerId: userId,
                category: { type: "EXPENSE" },
                deletedAt: null,
            },
            _sum: { amount: true },
        }),

        // B. Sum up all Payments sent (Settlements)
        prisma.payment.aggregate({
            where: {
                senderId: userId, // Money leaving your account
            },
            _sum: { amount: true },
        }),
    ]);

    // 2. Fetch Category Names for the Transactions
    // (We only need names for the IDs returned in expenseStats)
    const categoryIds = expenseStats
        .map((s) => s.categoryId)
        .filter((id): id is string => id !== null);

    const categoryDetails = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
    });

    // 3. Format Transaction Data
    const formattedCategories = expenseStats.map((stat) => {
        const category = categoryDetails.find((c) => c.id === stat.categoryId);
        return {
            name: category?.name || "Uncategorized",
            value: stat._sum.amount?.toNumber() || 0,
        };
    });

    // 4. Format Payment Data
    const totalPayments = paymentStats._sum.amount?.toNumber() || 0;
    if (totalPayments > 0) {
        formattedCategories.push({
            name: "Payments / Settlements", // This will show as a slice in the pie
            value: totalPayments,
        });
    }

    // 5. Final Sort & Filter
    return formattedCategories
        .filter((stat) => stat.value > 0) // Remove empty
        .sort((a, b) => b.value - a.value); // Biggest slices first
}
