import Sidebar from "@/components/sidebar";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserFinancialSummary } from "@/lib/accountBalance";

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();

    const currentUserId = currentUser?.id;

    const totalTransactionsThisMonth = await prisma.transaction.count({
        where: {
            // createdAt: {
            //     gte: new Date(
            //         new Date().getFullYear(),
            //         new Date().getMonth(),
            //         1,
            //     ),
            // },
            payerId: currentUserId,
        },
    });

    const recent5Transactions = await prisma.transaction.findMany({
        where: {
            payerId: currentUserId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        include: {
            category: true,
        },
    });

    const recent5Payemnts = await prisma.payment.findMany({
        where: {
            senderId: currentUserId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        include: {
            receiver: true,
        },
    });

    const currentFinanceSummary = await getUserFinancialSummary(currentUserId!);

    console.log("Total Transactions :", totalTransactionsThisMonth);
    console.log("Current Finance Summary :", currentFinanceSummary);
    console.log("Recent 5 Transactions :", recent5Transactions);
    console.log("Recent 5 Payments :", recent5Payemnts);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/dashboard" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                DashBoard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Welcome to your dashboard
                            </p>
                        </div>
                    </div>
                </div>
                {/* Key Metrics */}
            </main>
        </div>
    );
}
