import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    // console.log("Current User:", user);
    const [top10Transactions, top10Payments] = await Promise.all([
        prisma.transaction.findMany({
            where: { payerId: currentUserId },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { category: true, group: true, splits: true },
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
            include: {
                receiver: true,
                sender: true,
            },
        }),
    ]);
    const mixedTransactions = [...top10Transactions, ...top10Payments].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // console.log("Top 10 Transactions:", top10Transactions);
    // console.log("Top 10 Payments:", top10Payments);
    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
            <p>Here you can view and manage your transactions.</p>
            <div>
                {mixedTransactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="mb-4 rounded border p-4"
                    >
                        <h2 className="text-lg font-semibold">
                            {transaction.description}
                        </h2>
                        <p className="text-gray-600">
                            ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                            {transaction.category?.name || "No category"} •{" "}
                            {transaction.group?.name || "No group"}•{" "}
                            {transaction.createdAt.toLocaleDateString("en-IN")}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
