import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GroupsPage() {
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

    const groups = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    userId: currentUserId,
                },
            },
        },
        include: {
            transactions: {
                where: {
                    deletedAt: null, // CRITICAL: Hides deleted transactions
                },
            },
            members: {
                include: {
                    user: true,
                },
            },
        },
    });

    console.log("User's groups:", groups.length);

    return (
        <main className="flex h-full flex-1 flex-col p-6">
            <h1 className="mb-4 text-2xl font-bold">Groups</h1>
            {groups.map((group) => (
                <div key={group.id} className="mb-4 rounded border p-4">
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="text-sm text-gray-500">
                        Members:{" "}
                        {group.members.map((m) => m.user.name).join(", ")}
                    </p>
                </div>
            ))}
        </main>
    );
}
