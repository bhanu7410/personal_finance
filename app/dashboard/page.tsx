import Sidebar from "@/components/sidebar";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserFinancialSummary } from "@/lib/accountBalance";

import { TrendingUp, TrendingDown } from "lucide-react";

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

    const allTransactions = await prisma.transaction.findMany({
        where: {
            payerId: currentUserId,
        },
        orderBy: {
            createdAt: "desc",
        },
        // take: 5,
        include: {
            category: true,
        },
    });

    const allPayements = await prisma.payment.findMany({
        where: {
            OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
        orderBy: {
            createdAt: "desc",
        },
        // take: 5,
        include: {
            receiver: true,
            sender: true,
        },
    });

    const recent5TransactionAndPayment = [
        ...allTransactions.map((txn) => ({
            type: "transaction",
            amount: txn.amount,
            createdAt: txn.createdAt,
            id: txn.id,
            desc: txn.description,
            transactionType: txn.category!.type,
            transactionName: txn.category!.name,
            paymentToMe: null,
        })),
        ...allPayements.map((payment) => ({
            type: "payment",
            amount: payment.amount,
            createdAt: payment.createdAt,
            id: payment.id,
            desc: null,
            transactionType: "PAYMENT",
            transactionName:
                payment.receiverId === currentUserId
                    ? `Payment from ${payment.sender.name}`
                    : `Payment to ${payment.receiver.name}`,
            paymentToMe: payment.receiverId === currentUserId ? true : false,
        })),
    ]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

    const currentFinanceSummary = await getUserFinancialSummary(currentUserId!);

    console.log("Total Transactions :", totalTransactionsThisMonth);
    console.log("Amount Owned : ", currentFinanceSummary.unrealized.amountIOwe);
    console.log(
        "Current Cash  :",
        currentFinanceSummary.realized.currentCashBalance,
    );
    console.log(
        "Current Net Position :",
        currentFinanceSummary.summary.totalNetPosition,
    );

    console.log(
        "Recent 5 Transaction and Payment : ",
        recent5TransactionAndPayment,
    );

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
                    {/* Key Metrics */}
                    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                Key Metrics
                            </h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {totalTransactionsThisMonth}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Transactions
                                    </div>
                                    <div className="mt-1 flex items-center justify-center">
                                        <span className="text-xs text-green-600">
                                            +{totalTransactionsThisMonth}
                                        </span>
                                        <TrendingUp className="ml-1 h-3 w-3 text-green-600" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {
                                            currentFinanceSummary.unrealized
                                                .amountIOwe
                                        }
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Amount Owed
                                    </div>
                                    <div className="mt-1 flex items-center justify-center">
                                        <span className="text-xs text-red-600">
                                            +
                                            {
                                                currentFinanceSummary.unrealized
                                                    .amountIOwe
                                            }
                                        </span>
                                        <TrendingUp className="ml-1 h-3 w-3 text-red-600" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {
                                            currentFinanceSummary.realized
                                                .currentCashBalance
                                        }
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Current Cash
                                    </div>
                                    <div className="mt-1 flex items-center justify-center">
                                        <span className="text-xs text-green-600">
                                            +
                                            {
                                                currentFinanceSummary.realized
                                                    .currentCashBalance
                                            }
                                        </span>
                                        <TrendingUp className="ml-1 h-3 w-3 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* last 5 transactions or paymets */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Recent Account Activity
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {recent5TransactionAndPayment.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {item.type === "transaction"
                                                ? item.transactionName
                                                : item.transactionName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {item.type === "transaction"
                                                ? item.desc
                                                : "Payment Transaction"}
                                        </div>
                                    </div>
                                    <div
                                        className={`font-medium ${
                                            item.transactionType === "INCOME" ||
                                            item.paymentToMe
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {item.transactionType === "INCOME" ||
                                        item.paymentToMe
                                            ? `+${item.amount}`
                                            : `-${item.amount}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
