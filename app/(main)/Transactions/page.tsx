import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivityLayout } from "./_components/ActivityLayout";
import { ActivityItem } from "./_components/types";

export default async function TransactionsPage() {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <main className="flex h-full flex-1 flex-col p-6">
                <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
                <p>Please log in to view your transactions.</p>
            </main>
        );
    }

    const currentUserId = user.id;

    // 1. Fetching the data with the new safety checks
    const [topTransactions, topPayments] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                payerId: currentUserId,
                deletedAt: null, // CRITICAL: Hides deleted transactions
            },
            orderBy: { date: "desc" },
            take: 200,
            include: { category: true, group: true, splits: true },
        }),
        prisma.payment.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            orderBy: { date: "desc" },
            take: 200,
            include: {
                receiver: true,
                sender: true,
                group: true, // Included so we can grab the group currency
            },
        }),
    ]);

    // 2. Mapping the data into our enriched ActivityItem shape
    const recentActivity: ActivityItem[] = [
        ...topTransactions.map((txn) => {
            // Determine the exact type
            let itemType: ActivityItem["type"] = "Personal";
            if (txn.groupId) {
                itemType = "Group";
            } else if (txn.splits.length > 1) {
                itemType = "Split";
            }

            return {
                id: txn.id,
                type: itemType,
                name: txn.category?.name || "Uncategorized",
                desc: txn.description,
                amount: txn.amount.toNumber(),
                currency: txn.currency,
                date: txn.date.toISOString(), // Proper JSON serialization
                isIncome: txn.category?.type === "INCOME",

                // Extra table columns
                groupName: txn.group?.name,
                hasReceipt: !!txn.receiptUrl, // Converts truthy string to boolean
                splitCount: txn.splits.length,
            };
        }),
        ...topPayments.map((pmt) => {
            const isIncoming = pmt.receiverId === currentUserId;
            return {
                id: pmt.id,
                type: "Transfer" as const, // Uses your preferred naming
                name: isIncoming
                    ? `Transfer from ${pmt.sender?.name || "Unknown"}`
                    : `Transfer to ${pmt.receiver?.name || "Unknown"}`,
                desc: "Direct Transfer",
                amount: pmt.amount.toNumber(),
                currency: pmt.group?.currency || "INR",
                date: pmt.date.toISOString(),
                isIncome: isIncoming,

                // Extra table columns
                groupName: pmt.group?.name,
                hasReceipt: false, // Transfers usually don't have receipts in your schema
                splitCount: 0,
            };
        }),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
            <p className="mb-6 text-gray-500">
                Here you can view and manage your transactions.
            </p>

            <ActivityLayout data={recentActivity} />
        </main>
    );
}
