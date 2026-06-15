import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Receipt } from "lucide-react";
import { GroupDashboardClient } from "./_components/GroupDashboardClient";

export default async function GroupDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return null;

    // Fetch the group, its members, and all transactions
    const group = await prisma.group.findUnique({
        where: { id },
        include: {
            members: {
                include: { user: true },
            },
            transactions: {
                where: { deletedAt: null },
                include: {
                    category: true,
                    payer: true,
                },
                orderBy: { date: "desc" },
            },
        },
    });

    if (!group) return notFound();

    // Security check: must be a member
    const isMember = group.members.some((m) => m.userId === user.id);
    if (!isMember) return notFound();

    const clientTransactions = group.transactions.map(txn => ({
        id: txn.id,
        description: txn.description,
        amount: txn.amount.toNumber(),
        date: txn.date.toISOString(),
        currency: txn.currency,
        category: txn.category ? {
            id: txn.category.id,
            name: txn.category.name,
            icon: txn.category.icon
        } : null,
        payer: {
            id: txn.payer.id,
            name: txn.payer.name || "Unknown"
        },
        splitCount: 0 // We don't need splits for this view anymore
    }));

    const clientMembers = group.members.map(m => ({
        id: m.userId,
        name: m.user.name || "Unknown",
        role: m.role
    }));

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <div className="mb-8">
                <Link
                    href="/groups"
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Groups
                </Link>
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900">{group.name}</h1>
                        <div className="mt-2 flex items-center gap-4 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-gray-400" />
                                {group.members.length} Members
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Receipt className="h-4 w-4 text-gray-400" />
                                {group.transactions.length} Transactions
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GroupDashboardClient 
                transactions={clientTransactions} 
                members={clientMembers}
                currency={group.currency}
            />
        </main>
    );
}
