import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivityComponent } from "./_components/ActivityComponent";

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

    const [topTransactions, topPayments] = await Promise.all([
        prisma.transaction.findMany({
            where: { payerId: currentUserId },
            orderBy: { createdAt: "desc" },
            take: 100,
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
            take: 100,
            include: {
                receiver: true,
                sender: true,
            },
        }),
    ]);

    const recentActivity = [
        ...topTransactions.map((txn) => ({
            id: txn.id,
            type: "transaction",
            name: txn.category?.name || "Uncategorized",
            desc: txn.description,
            amount: txn.amount.toNumber(),
            date: txn.createdAt,
            isIncome: txn.category?.type === "INCOME",
        })),
        ...topPayments.map((pmt) => {
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
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
            <p>Here you can view and manage your transactions.</p>

            <ActivityComponent data={recentActivity} />
        </main>
    );
}
