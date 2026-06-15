import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GroupListItem } from "./_components/types";
import { GroupLayout } from "./_components/GroupLayout";

export default async function GroupsPage() {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <main className="flex h-full flex-1 flex-col p-6">
                <h1 className="mb-4 text-2xl font-bold">Groups</h1>
                <p>Please log in to view your groups.</p>
            </main>
        );
    }

    const currentUserId = user.id;

    // Fetch groups where the user is a member
    const groups = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    userId: currentUserId,
                },
            },
        },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            transactions: {
                where: {
                    deletedAt: null,
                },
                select: {
                    amount: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Transform data for the UI
    const groupListData: GroupListItem[] = groups.map((group) => {
        const totalSpent = group.transactions.reduce(
            (sum, txn) => sum + txn.amount.toNumber(),
            0
        );

        return {
            id: group.id,
            name: group.name,
            description: group.description,
            currency: group.currency,
            totalSpent,
            memberCount: group.members.length,
            members: group.members.map((m) => ({
                id: m.user.id,
                name: m.user.name || "Unknown",
                email: m.user.email,
                role: m.role,
            })),
            createdAt: group.createdAt.toISOString(),
        };
    });

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Groups</h1>
                <p className="text-gray-500">
                    Manage your shared expenses and group members.
                </p>
            </div>

            <GroupLayout initialData={groupListData} />
        </main>
    );
}
